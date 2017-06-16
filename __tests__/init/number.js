import number from 'init/number';
describe('init/string', () => {
  test('@string can set property initialize to be number', () => {
    class Foo {
      @number()
      bar = 1;
      @number()
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('number');
    expect(typeof foo.car).toBe('number');
  });
});