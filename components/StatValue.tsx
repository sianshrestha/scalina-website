import Counter from '@/components/Counter';

/* A figure that counts up when it can and prints as-is when it can't.

   "55+" counts to 55 and keeps its plus, "$1.9" keeps its dollar sign;
   "24/7", "3-4" and "Xero" are not
   quantities and are printed exactly. Parsing here rather than storing a
   number keeps the data file readable as the sentence it will be read as. */
export default function StatValue({ value }: { value: string }) {
  const match = /^([$]?)(\d+(?:\.\d+)?)([^\d/-]*)$/.exec(value);
  if (!match) return <>{value}</>;
  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
  return (
    <>
      {prefix}
      <Counter value={Number(digits)} suffix={suffix} decimals={decimals} />
    </>
  );
}
