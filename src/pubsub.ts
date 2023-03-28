type Fn = (...val: any[]) => void;
// rollup (rpt2 plugin) not working with symbol index
// type Key = string | symbol;
type Key = string;
export class Pubsub {
  private listeners: Record<Key, Fn[]>;
  constructor() {
    this.listeners = {};
  }

  subscribe(name: Key, fn: Fn) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(fn);
    return () => {
      this.unsubscribe(name, fn);
    };
  }

  publish(name: Key, ...vals: any[]) {
    const fns = this.listeners[name] ?? [];
    for (const fn of fns) {
      fn(...vals);
    }
  }

  unsubscribe(name: Key, fn: Fn) {
    let i = 0;
    while (i < this.listeners[name].length) {
      const listener = this.listeners[name][i];
      if (fn === listener) {
        break;
      }
      i++;
    }
    this.listeners[name].splice(i, 1);
  }
}
