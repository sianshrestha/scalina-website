// Screenshots the OZI HP WMS frontend against stubbed API responses.
// Illustrative sample data only — the UI is real, the rows are not.
import { chromium } from 'playwright';

const BASE = 'http://localhost:5301';
const OUT = process.argv[2] || './shots';
const iso = (d) => new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);

const customers = ['Harbour Kitchen', 'Bayside Café', 'Northside Bakery Co.', 'Parramatta Grill House', 'Green Leaf Catering', 'Little Saigon Eatery', 'Coastline Fish & Chips', 'Urban Brew Roasters', 'Marigold Thai', 'The Corner Deli'];
const products = [
  ['VFC-500', 'Vented Food Container 500ml', 38.5], ['KPB-M', 'Kraft Paper Bag — Medium', 24.0], ['NGL-BL', 'Nitrile Gloves Black — L', 52.0],
  ['AFT-4', 'Aluminium Foil Tray No.4', 31.2], ['HTR-80', 'Hand Towel Roll 80m', 46.9], ['CUP-12', 'Double-Wall Cup 12oz', 58.4],
  ['LID-12', 'Sip Lid 12oz', 19.9], ['NAP-2P', 'Dinner Napkin 2-Ply', 27.5], ['CUT-KIT', 'Wooden Cutlery Kit', 44.0], ['SBG-L', 'Singlet Bag — Large', 22.6],
];
const statuses = ['ORDERED', 'DOCKET_PRINTED', 'DISPATCHED', 'INVOICED', 'INVOICED', 'ORDERED', 'DISPATCHED', 'INVOICED', 'DRAFT', 'INVOICED'];

const orders = Array.from({ length: 14 }, (_, i) => ({
  id: `o${i}`, orderNumber: `SO-${(10482 - i).toString()}`, customerId: `c${i % 10}`, customerName: customers[i % 10],
  status: statuses[i % 10], docketPrinted: i % 3 !== 0, dispatched: i % 2 === 0, deliveryDate: iso(i % 5), invoiceDate: statuses[i % 10] === 'INVOICED' ? iso(i) : null,
  xeroInvoiceId: statuses[i % 10] === 'INVOICED' ? `x${i}` : null, xeroInvoiceNumber: statuses[i % 10] === 'INVOICED' ? `INV-${5120 - i}` : null,
  paymentStatus: statuses[i % 10] === 'INVOICED' ? (i % 4 ? 'PAID' : 'AWAITING_PAYMENT') : null,
  totalAmount: [412.5, 1286.0, 298.4, 764.2, 1540.8, 356.0, 918.6, 2204.1, 190.0, 648.3][i % 10], totalPaid: i % 4 ? [412.5, 1286.0, 298.4, 764.2, 1540.8, 356.0, 918.6, 2204.1, 190.0, 648.3][i % 10] : 0,
  createdBy: 'Admin', items: [],
}));

const trend = Array.from({ length: 30 }, (_, i) => {
  const base = 3200 + Math.sin(i / 3) * 900 + i * 60 + (i % 7 === 5 ? -1400 : 0);
  return { periodLabel: iso(29 - i), revenue: Math.round(base), grossMargin: Math.round(base * 0.34) };
});

const stops = customers.slice(0, 6).map((c, i) => ({
  orderId: `o${i}`, orderNumber: `SO-${10482 - i}`, customerName: c, addressLine: `${12 + i * 7} ${['George St', 'Church St', 'Pitt St', 'Victoria Rd', 'Oxford St', 'King St'][i]}`,
  suburb: ['Sydney', 'Parramatta', 'Sydney', 'Ryde', 'Paddington', 'Newtown'][i], state: 'NSW', postcode: ['2000', '2150', '2000', '2112', '2021', '2042'][i],
  phone: '02 9000 0000', deliveryDate: iso(0), requestedDeliveryTime: ['Before 9am', null, 'After 11am', null, 'Before 10am', null][i],
  customerNote: i === 1 ? 'Rear loading dock — ring the bell.' : null, docketNote: null, orderNote: null,
  itemCount: 3 + (i % 3), totalUnits: 12 + i * 4, dispatched: i < 2,
  items: products.slice(i, i + 3 + (i % 3)).map(([code, name], k) => ({ productCode: code, productName: name, quantity: 2 + k, uom: 'CTN' })),
}));

function fixture(path, url) {
  if (path.endsWith('/admin/me/permissions')) return { name: 'Warehouse Admin', email: 'admin@ozihp.com.au', administrator: true, roles: ['ADMIN'], permissions: [] };
  if (path.endsWith('/dashboard/financial')) return { totalRevenue: 128460.5, grossMargin: 43676.2, totalExpenses: 18240, totalCredited: 1240, netProfit: 25436.2, outstandingReceivables: 21480.4, overdueAmount: 3120.0, invoicedOrderCount: 312, averageOrderValue: 411.7, revenueGrowthPercent: 12.4 };
  if (path.endsWith('/dashboard/revenue-trend')) return trend;
  if (path.endsWith('/dashboard/order-status')) return [{ status: 'ORDERED', count: 18 }, { status: 'DOCKET_PRINTED', count: 9 }, { status: 'DISPATCHED', count: 14 }, { status: 'INVOICED', count: 312 }, { status: 'DRAFT', count: 4 }];
  if (path.endsWith('/dashboard/orders-awaiting-invoice')) return { count: 14 };
  if (path.endsWith('/dashboard/inventory')) return { totalActiveProducts: 486, lowStockCount: 7, criticalStockCount: 2, totalInventoryValue: 184320, lowStockItems: products.slice(0, 5).map(([code, name], i) => ({ productId: `p${i}`, productCode: code, productName: name, category: 'Packaging', quantityOnHand: 4 + i * 3, allocatedQuantity: 2, availableQuantity: 2 + i * 3, lowStockThreshold: 20, uom: 'CTN' })), slowMovingProducts: [] };
  if (path.endsWith('/dashboard/activity')) return customers.slice(0, 6).map((c, i) => ({ kind: i % 3 === 2 ? 'INVENTORY' : 'ORDER_NOTE', title: i % 3 === 2 ? 'Stock received' : `Order SO-${10482 - i}`, detail: i % 3 === 2 ? `${products[i][1]} +40 CTN` : `${c} — deliver before 9am`, entityType: i % 3 === 2 ? 'product' : 'order', entityId: `o${i}`, reference: null, occurredAt: new Date(Date.now() - i * 5400e3).toISOString() }));
  if (path.includes('/dashboard/') || path.includes('/reports/')) return path.includes('stale') ? { thresholdDays: 60, products: [] } : { trend: trend.map((t) => ({ date: t.periodLabel, revenue: t.revenue, units: Math.round(t.revenue / 30) })), rows: products.slice(0, 8).map(([code, name, p], i) => ({ productId: `p${i}`, code, name, revenue: Math.round(p * (80 - i * 7)), unitsSold: 80 - i * 7 })) };
  if (path.endsWith('/orders/run')) return stops;
  if (/\/orders$/.test(path)) { const size = Number(url.searchParams.get('size') || 20); return { content: orders.slice(0, size), totalElements: 368, totalPages: 19, size, number: 0 }; }
  if (path.endsWith('/portal/data/catalog')) return products.map(([code, name, p], i) => ({ id: `p${i}`, code, name, defaultUnitPrice: p }));
  if (path.includes('/standard-orders')) return products.slice(0, 6).map(([code, name, p], i) => ({ productId: `p${i}`, productCode: code, productName: name, customUnitPrice: +(p * 0.92).toFixed(2) }));
  if (path.includes('/portal/')) return path.includes('profile') || path.includes('/me') ? { id: 'c0', name: customers[0], businessName: customers[0], email: 'orders@harbourkitchen.example' } : [];
  return null;
}

const shots = [
  { name: 'wms-dashboard', path: '/', w: 1440, h: 1000, admin: true },
  { name: 'wms-orders', path: '/orders', w: 1440, h: 900, admin: true },
  { name: 'wms-driver', path: '/driver', w: 430, h: 932, admin: true, mobile: true },
  { name: 'wms-portal-order', path: '/portal/order-builder', w: 1440, h: 900, portal: true },
];

const browser = await chromium.launch({ channel: 'chrome' });
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2, isMobile: !!s.mobile, hasTouch: !!s.mobile, colorScheme: 'light' });
  await ctx.addInitScript(() => {
    localStorage.setItem('adminJwt', 'demo'); localStorage.setItem('adminRefreshToken', 'demo'); localStorage.setItem('adminId', 'a1'); localStorage.setItem('adminName', 'Warehouse Admin');
    localStorage.setItem('portalJwt', 'demo'); localStorage.setItem('portalRefreshToken', 'demo'); localStorage.setItem('portalCustomerId', 'c0');
  });
  const page = await ctx.newPage();
  const unknown = new Set();
  await page.route('**/api/**', (route) => {
    const url = new URL(route.request().url());
    const body = fixture(url.pathname, url);
    if (body === null) { unknown.add(url.pathname); return route.fulfill({ json: [] }); }
    return route.fulfill({ json: body });
  });
  await page.route('**/ws/**', (r) => r.abort());
  await page.goto(BASE + s.path, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  console.log(s.name, page.url(), [...unknown].join(' '));
  await ctx.close();
}
await browser.close();
