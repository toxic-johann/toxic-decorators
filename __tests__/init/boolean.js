import { initBoolean } from 'index';
describe('init/boolean', () => {
  test('@initBoolean can set property initialize to be boolean', () => {
    class Foo {
      @initBoolean()
      bar = true;
      @initBoolean()
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('boolean');
    expect(typeof foo.car).toBe('boolean');
  });
  test('@initBoolean can set property initialize to be boolean', () => {
    class Foo {
      @initBoolean()
      bar = true;
      @initBoolean(false)
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('boolean');
    expect(foo.bar).toBe(true);
    expect(typeof foo.car).toBe('boolean');
    expect(foo.car).toBe(false);
  });
});
