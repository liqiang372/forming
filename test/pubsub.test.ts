import { Pubsub } from '../src/pubsub';

describe('pubsub', () => {
  test('basic', () => {
    const pubsub = new Pubsub();
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    pubsub.subscribe('username', fn1);
    pubsub.subscribe('username', fn2);

    pubsub.publish('username', 'hello');

    expect(fn1).toBeCalledWith('hello');
    expect(fn2).toBeCalledWith('hello');

    pubsub.unsubscribe('username', fn1);
    pubsub.publish('username', 'world');
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledWith('world');
  });
});
