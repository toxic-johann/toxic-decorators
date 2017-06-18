import {initArray} from 'index';
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
});
