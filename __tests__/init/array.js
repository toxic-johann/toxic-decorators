import array from 'init/array';
describe('init/array', () => {
  test('@array can set property initialize to be array', () => {
    class Foo {
      @array()
      bar = 1;
      @array()
      car = [];
    }
    const foo = new Foo();
    expect(Array.isArray(foo.bar)).toBe(true);
    expect(Array.isArray(foo.car)).toBe(true);
  });
});
