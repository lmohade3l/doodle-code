export function isValidNationalCode(value: string): boolean {
  const n = Number(value);
  if (Number.isNaN(n)) return false;
  return value.length === 10;
}

export function isValidMobile(value: string): boolean {
  return /^09\d{9}$/.test(value);
}
