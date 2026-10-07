// Screenshots Scalina CRM against stubbed API responses. Sample data only.
import { chromium } from 'playwright';

const BASE = 'http://localhost:5303';
const OUT = process.argv[2] || './shots';
const day = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);

const team = [
  { id: 1, name: 'Aarav Shrestha', firstName: 'Aarav', lastName: 'Shrestha', role: 'EDITOR' },
  { id: 2, name: 'Mia Tran', firstName: 'Mia', lastName: 'Tran', role: 'SCRIPTWRITER' },
  { id: 3, name: 'Jordan Lee', firstName: 'Jordan', lastName: 'Lee', role: 'VIDEOGRAPHER' },
  { id: 4, name: 'Priya Gurung', firstName: 'Priya', lastName: 'Gurung', role: 'MARKETER' },
];
const names = [['Harbour Kitchen', 'HK01'], ['Bayside Tours', 'BT02'], ['Northside Bakery', 'NB03'], ['Green Leaf Catering', 'GL04'], ['Urban Brew', 'UB05']];
const stages = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'PROPOSAL_SENT', 'CONTACTED', 'NEW', 'NEW', 'CONTACTED', 'INACTIVE'];
const pipeline = [
  ...names.map(([n, code], i) => ({ id: i + 1, clientCode: i < 3 ? code : undefined, name: ['Sam', 'Ava', 'Leo', 'Zoe', 'Kai'][i], company: n, email: `hello@${n.toLowerCase().replace(/\W/g, '')}.example`, pipelineStage: stages[i], client: i < 3, marketer: team[3], estimatedWeeklyRevenue: [650, 900, 450, 700, 500][i], marketersCut: 10, tags: ['Hospitality', 'Tourism', 'Food', 'Catering', 'Café'][i] })),
  ...['Coastline Dental', 'Kings Cross Fitness', 'Eastwood Florist', 'Lumen Studio'].map((n, k) => ({ id: 10 + k, name: ['Ella', 'Max', 'Ruby', 'Noah'][k], company: n, email: 'lead@example.com', pipelineStage: stages[5 + k], client: false, estimatedWeeklyRevenue: 400 + k * 120, tags: 'Lead' })),
];
const projects = [];
let pid = 1;
for (const c of pipeline.filter((c) => c.client)) {
  for (let w = 1; w <= 3; w++) {
    projects.push({ id: pid++, projectCode: `${c.clientCode}-W${String(17 + w).padStart(2, '0')}`, weekCode: `WK ${17 + w}`, numberOfVideos: 4, scriptStatus: w < 3 ? 'DONE' : 'IN_PROGRESS', shootStatus: w < 2 ? 'DONE' : w === 2 ? 'IN_PROGRESS' : 'PENDING', overallEditStatus: w < 2 ? 'DONE' : 'PENDING', overallProjectStatus: w < 2 ? 'COMPLETED' : 'IN_PROGRESS', projectDeadline: day(w * 3 - 3), client: c });
  }
}
const tasks = [];
let tid = 1;
projects.forEach((p, i) => {
  ['SCRIPT', 'SHOOT', 'EDIT'].forEach((t, k) => {
    for (let v = 1; v <= 2; v++) tasks.push({ id: tid++, title: `${t[0] + t.slice(1).toLowerCase()} — video ${v}`, taskType: t, assignee: team[k === 0 ? 1 : k === 1 ? 2 : 0].name, videoNumber: v, taskDate: day((i % 3) * 2 + k - 2 + v), completed: i % 3 === 0 || (k === 0 && i % 3 === 1), project: p });
  });
});
const invoices = pipeline.filter((c) => c.client).flatMap((c, i) => [0, 1, 2, 3].map((m) => ({ id: i * 10 + m, invoiceNo: `SC-${2040 + i * 4 + m}`, client: c, clientId: c.id, amount: c.estimatedWeeklyRevenue * 4, invoiceDate: day(-m * 28 - (i + 1) * 4), dueDate: day(-m * 28 + 11), hasGst: true, weeksCovered: 4, gstAmount: c.estimatedWeeklyRevenue * 0.4, status: m === 0 && i === 2 ? 'SENT' : 'PAID', items: [{ description: 'Weekly short-form content (4 videos/wk)', quantity: 4, price: c.estimatedWeeklyRevenue }] })));
const expenses = ['Adobe Creative Cloud', 'Camera lens rental', 'Meta ads — test budget', 'Studio hire', 'Hosting'].map((t, i) => ({ id: i + 1, title: t, type: ['SOFTWARE', 'EQUIPMENT', 'ADVERTISING', 'STUDIO', 'SOFTWARE'][i], payee: t.split(' ')[0], amount: [89.99, 240, 300, 180, 42][i], expenseDate: day(-i * 6), isPaid: i !== 2, isRecurring: i === 0 || i === 4, frequency: 'MONTHLY' }));

function fixture(path) {
  const p = path.replace(/^\/api\/crm/, '');
  if (p === '/pipeline') return pipeline;
  if (p === '/projects') return projects;
  if (p === '/tasks') return tasks;
  if (p === '/team') return team;
  if (p === '/invoices') return invoices;
  if (p === '/expenses') return expenses;
  if (/^\/clients\/\d+\/projects$/.test(p)) return projects.filter((x) => x.client.id === Number(p.split('/')[2]));
  if (/^\/projects\/\d+\/tasks$/.test(p)) return tasks.filter((x) => x.project.id === Number(p.split('/')[2]));
  if (p === '/dashboard') return {};
  return null;
}

const shots = [['crm-dashboard', 'Dashboard'], ['crm-projects', 'Project Management'], ['crm-leads', 'Leads & Clients'], ['crm-calendar', 'Resource Calendar'], ['crm-invoicing', 'Invoicing']];
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const unknown = new Set();
await page.route('http://localhost:8080/**', (route) => {
  const url = new URL(route.request().url());
  const body = fixture(url.pathname);
  if (body === null) { unknown.add(url.pathname); return route.fulfill({ json: [] }); }
  return route.fulfill({ json: body });
});
await page.goto(BASE, { waitUntil: 'networkidle' });
for (const [name, label] of shots) {
  await page.getByText(label, { exact: true }).first().click().catch((e) => console.log('click', label, e.message));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name);
}
console.log('unknown', [...unknown].join(' '));
await browser.close();
