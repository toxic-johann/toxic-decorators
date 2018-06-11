import { initArray } from 'index';
describe('init/array', () => {
  test('@initArray can set property initialize to be array', () => {
    class Foo {
      @initArray()
      bar = 1;
      @initArray()
      car = [];
    }
    const foo = new Foo();
    expect(Array.isArray(foo.bar)).toBe(true);
    expect(Array.isArray(foo.car)).toBe(true);
  });
  test('@initArray support custom initial value', () => {
    class Foo {
      @initArray([ 12 ])
      bar = 1;
      @initArray([ 23 ])
      car = [];
    }
    const foo = new Foo();
    expect(Array.isArray(foo.bar)).toBe(true);
    expect(foo.bar).toEqual([ 12 ]);
    expect(Array.isArray(foo.car)).toBe(true);
    expect(foo.car).toEqual([]);
  });
});
