import { initNumber } from 'index';
describe('init/number', () => {
  test('@initNumber can set property initialize to be number', () => {
    class Foo {
      @initNumber()
      bar = 1;
      @initNumber()
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('number');
    expect(typeof foo.car).toBe('number');
  });
  test('@initNumber support custom initial value', () => {
    class Foo {
      @initNumber(2)
      bar = 1;
      @initNumber(3)
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('number');
    expect(foo.bar).toBe(1);
    expect(typeof foo.car).toBe('number');
    expect(foo.car).toBe(3);
  });
});
