import boolean from 'init/boolean';
describe('init/boolean', () => {
  test('@boolean can set property initialize to be boolean', () => {
    class Foo {
      @boolean()
      bar = true;
      @boolean()
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('boolean');
    expect(typeof foo.car).toBe('boolean');
  });
});
