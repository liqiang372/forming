export function isEmpty(val: null | undefined | string): boolean {
  return val === null || val === undefined || val.trim().length === 0;
}

export function parsePath(name: string): string[] {
  const paths = name.split('.');
  const result = [];
  for (const path of paths) {
    let cur = '';
    for (let i = 0; i < path.length; i++) {
      const c = path[i];
      if (c === '[' || c === ']') {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    if (cur !== '') {
      result.push(cur);
    }
  }
  return result;
}
