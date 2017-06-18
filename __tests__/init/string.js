import {initString} from 'index';
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
});
