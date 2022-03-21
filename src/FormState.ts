import { FormInitialValues, ValidationLevel } from './types';
import { isEmpty, parsePath } from './utils';

const ALL_KEY = Symbol('all');
export class FormState {
  options: {
    initialValues: FormInitialValues;
    validationLevel: ValidationLevel;
  };
  private values: FormInitialValues;
  private validateRules: Record<string, any>;
  private errors: Record<string, any>;
  private listeners: Record<
    string | symbol,
    { errors: ((errors: string[]) => void)[]; values: ((value: any) => void)[] }
  >;
  constructor({
    initialValues = {},
    validationLevel = 'first',
  }: {
    initialValues?: FormInitialValues;
    validationLevel?: ValidationLevel;
  }) {
    this.options = {
      initialValues,
      validationLevel,
    };
    this.values = initialValues;
    this.validateRules = {};
    this.errors = {};
    this.listeners = {};
  }

  setValue(rawName: string, value: any) {
    const paths = parsePath(rawName);
    let tmp = this.values;
    for (let i = 0; i < paths.length - 1; i++) {
      tmp = tmp[paths[i]];
    }
    tmp[paths[paths.length - 1]] = value;
    // TODO: deal with array or object
    for (const listener of this.listeners[rawName]?.values ?? []) {
      listener(value);
    }
  }
  getValue(rawName: string): any {
    const paths = parsePath(rawName);
    let value = this.values;
    for (const path of paths) {
      value = value[path];
    }
    return value;
  }
  getValues() {
    return this.values;
  }

  getErrors() {
    return this.errors;
  }

  updateErrors(name: string, errors: any[] | undefined) {
    if (errors === undefined || errors.length === 0) {
      delete this.errors[name];
    } else {
      this.errors[name] = errors;
    }
    this.notifyErrors(name);
  }

  subscribeErrors(name: string | undefined, fn: (errors: any[]) => void) {
    return this.subscribe(name, 'errors', fn);
  }

  subscribeValues(name: string | undefined, fn: (values: any[]) => void) {
    return this.subscribe(name, 'values', fn);
  }

  private subscribe(
    name: string | undefined,
    category: 'errors' | 'values',
    fn: (val: any) => void,
  ) {
    const key = name ?? (ALL_KEY as any);
    if (!this.listeners[key]) {
      this.listeners[key] = { errors: [], values: [] };
    }
    if (!this.listeners[key][category]) {
      this.listeners[key][category] = [];
    }

    this.listeners[key][category].push(fn);
    return () => {
      let i = 0;
      while (i < this.listeners[key][category].length) {
        const listener = this.listeners[key][category][i];
        if (listener === fn) {
          break;
        }
        i++;
      }
      this.listeners[key][category].splice(i, 1);
    };
  }

  notifyErrors(name: string) {
    const subs = this.listeners[name];
    for (const sub of subs.errors) {
      sub(this.errors[name]);
    }
  }

  setValidateRules(name: string, rules: any) {
    this.validateRules[name] = rules;
  }

  async validate(name: string, syncOnly?: boolean) {
    const rules = this.validateRules[name];
    if (rules) {
      const errors = [];
      const val = this.getValue(name);
      for (const rule in rules) {
        if (errors.length > 0) {
          if (this.options.validationLevel === 'first') {
            // stop validation on first error
            break;
          }
        }
        const handler = rules[rule];
        if (
          rule === 'required' &&
          typeof handler === 'string' &&
          isEmpty(val)
        ) {
          errors.push({
            rule: 'required',
            message: handler,
          });
          continue;
        }
        if (typeof handler === 'function') {
          let res = undefined;
          if (handler.constructor.name === 'AsyncFunction') {
            if (!syncOnly) {
              res = await handler(val ?? '');
            } else {
              continue;
            }
          } else {
            res = handler(val ?? '');
          }
          if (!['boolean', 'string'].includes(typeof res)) {
            throw new Error('Expect Boolean or String from validation handler');
          }
          if (res === false || res.length > 0) {
            errors.push({
              rule,
              message: typeof res === 'string' ? res : '',
            });
          }
        }
      }
      if (val === this.getValue(name)) {
        // Need to check if the value is still the same in case the value is stale bc of async validation
        this.updateErrors(name, errors.length > 0 ? errors : undefined);
      }
    }
  }

  async validateAll({ syncOnly }: { syncOnly?: boolean } = {}) {
    const names = Object.keys(this.validateRules);
    await Promise.allSettled(names.map(name => this.validate(name, syncOnly)));
  }
}
