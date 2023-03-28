import { FieldError } from './types';

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

export function isSameError(e1: FieldError, e2: FieldError) {
  return e1.rule === e2.rule && e1.message === e2.message;
}

export function areSameErrors(
  es1: FieldError[] | undefined,
  es2: FieldError[] | undefined,
) {
  if (es1 === undefined && es2 === undefined) {
    return true;
  }
  if (es1 === undefined || es2 === undefined) {
    return false;
  }
  if (es1.length !== es2.length) {
    return false;
  }
  for (let i = 0; i < es1.length; i++) {
    if (!isSameError(es1[i], es2[i])) {
      return false;
    }
  }
  return true;
}
