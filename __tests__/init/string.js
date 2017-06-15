import string from 'init/string';
describe('init/string', () => {
  test('@string can set property initialize to be string', () => {
    class Foo {
      @string()
      bar = 1;
      @string()
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('string');
    expect(typeof foo.car).toBe('string');
  });
});
