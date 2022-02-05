export function isEmpty(val: null | undefined | string): boolean {
  return val === null || val === undefined || val.trim().length === 0;
}

export function parseArrayLikeName(name: string): {
  name: string;
  index?: number;
} {
  const regex = /^([^\[]*)\[(\d+)\]$/gi;
  const match = regex.exec(name);
  if (match !== null) {
    return {
      name: match[1],
      index: Number(match[2]),
    };
  }
  return {
    name,
  };
}

export function parseObjectLikeName(name: string) {
  return name.split('.');
}
