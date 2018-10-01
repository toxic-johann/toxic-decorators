import { alwaysNumber } from 'index';
describe('always/number', () => {
  class Foo {
    @alwaysNumber(3)
    bar = '1';
    _car = '1';
    @alwaysNumber()
    get car() {
      return this._car;
    }
    set car(value) {
      this._car = value;
      return this._car;
    }
    @alwaysNumber(x => x / 2)
    lar = 2;
  }

  test('@alwaysNumber support custom value', () => {
    const foo = new Foo();
    expect(foo.bar).toBe(3);
  });

  test('@alwaysNumber can may property always be number', () => {
    const foo = new Foo();
    expect(typeof foo.bar).toBe('number');
    foo.bar = '123';
    expect(typeof foo.bar).toBe('number');
    foo.bar = 456;
    expect(typeof foo.bar).toBe('number');
  });

  test('@alwaysNumber can may getter/setter always be number', () => {
    const foo = new Foo();
    expect(typeof foo.car).toBe('number');
    expect(typeof foo._car).not.toBe('number');
    foo.car = '123';
    expect(typeof foo.car).toBe('number');
    expect(typeof foo._car).toBe('number');
    foo.car = 456;
    expect(typeof foo.car).toBe('number');
    expect(typeof foo._car).toBe('number');
  });

  test('@alwaysNumber accept function too', () => {
    const foo = new Foo();
    expect(foo.lar).toEqual(1);
    foo.lar = 10;
    expect(foo.lar).toEqual(2.5);
    foo.lar = '12';
    expect(foo.lar).toEqual(0);
  });
});
