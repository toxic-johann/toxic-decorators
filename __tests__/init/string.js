import { initString } from 'index';
describe('init/string', () => {
  test('@initString can set property initialize to be string', () => {
    class Foo {
      @initString()
      bar = 1;
      @initString()
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('string');
    expect(typeof foo.car).toBe('string');
  });
  test('@initString support initial value', () => {
    class Foo {
      @initString('123')
      bar = 1;
      @initString('234')
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('string');
    expect(typeof foo.car).toBe('string');
    expect(foo.bar).toBe('123');
    expect(foo.car).toBe('car');
  });
});
