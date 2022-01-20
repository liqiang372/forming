export function isEmpty(val: null | undefined | string): boolean {
  return val === null || val === undefined || val.trim().length === 0;
}
