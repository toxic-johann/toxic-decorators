import { alwaysString } from 'index';
describe('always/string', () => {
  class Foo {
    @alwaysString('hello')
    bar = 1;
    _car = 1;
    @alwaysString()
    get car() {
      return this._car;
    }
    set car(value) {
      this._car = value;
      return this._car;
    }

    @alwaysString(x => (x.length > 0 ? x : '123'))
    lar = '213';
  }

  test('@alwaysString support custom value', () => {
    const foo = new Foo();
    expect(foo.bar).toBe('hello');
  });

  test('@alwaysString can may property always be string', () => {
    const foo = new Foo();
    expect(typeof foo.bar).toBe('string');
    foo.bar = '123';
    expect(typeof foo.bar).toBe('string');
    foo.bar = 456;
    expect(typeof foo.bar).toBe('string');
  });

  test('@alwaysString can may getter/setter always be string', () => {
    const foo = new Foo();
    expect(typeof foo.car).toBe('string');
    expect(typeof foo._car).not.toBe('string');
    foo.car = '123';
    expect(typeof foo.car).toBe('string');
    expect(typeof foo._car).toBe('string');
    foo.car = 456;
    expect(typeof foo.car).toBe('string');
    expect(typeof foo._car).toBe('string');
  });

  test('@alwaysString accept function too', () => {
    const foo = new Foo();
    expect(foo.lar).toEqual('213');
    foo.lar = 10;
    expect(foo.lar).toEqual('123');
    foo.lar = '12';
    expect(foo.lar).toEqual('12');
  });
});
