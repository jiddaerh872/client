export function formatNaira(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₦0';
  const num = Number(amount);
  return `₦${num.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}
