import { alwaysArray } from 'index';
describe('always/array', () => {
  class Foo {
    @alwaysArray([ 1, 2, 3 ])
    bar = 1;
    _car = 1;
    @alwaysArray()
    get car() {
      return this._car;
    }
    set car(value) {
      this._car = value;
      return this._car;
    }
    @alwaysArray(x => (x.length > 0 ? x : [ 12 ]))
    lar = 2;
  }

  test('@alwaysArray support custome value', () => {
    const foo = new Foo();
    expect(foo.bar).toEqual([ 1, 2, 3 ]);
  });

  test('@alwaysArray can may property always be array', () => {
    const foo = new Foo();
    expect(Array.isArray(foo.bar)).toBe(true);
    foo.bar = '123';
    expect(Array.isArray(foo.bar)).toBe(true);
    foo.bar = 456;
    expect(Array.isArray(foo.bar)).toBe(true);
  });

  test('@alwaysArray can may getter/setter always be array', () => {
    const foo = new Foo();
    expect(Array.isArray(foo.car)).toBe(true);
    expect(Array.isArray(foo._car)).not.toBe(true);
    foo.car = [];
    expect(Array.isArray(foo.car)).toBe(true);
    expect(Array.isArray(foo._car)).toBe(true);
    foo.car = 456;
    expect(Array.isArray(foo.car)).toBe(true);
    expect(Array.isArray(foo._car)).toBe(true);
  });

  test('@alwaysArray accept function too', () => {
    const foo = new Foo();
    expect(foo.lar).toEqual([ 12 ]);
    foo.lar = [ 1, 2 ];
    expect(foo.lar).toEqual([ 1, 2 ]);
  });
});
