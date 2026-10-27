/**
 * Currency and Number formatting utilities
 * Ensures standard formatting with commas and 2 decimal places (e.g., "Rs. 95,000.00")
 */

export function formatLKR(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0.00';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCurrency(val: number | string | undefined | null): string {
  return `Rs. ${formatLKR(val)}`;
}

export function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}
