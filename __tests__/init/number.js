import {initNumber} from 'index';
describe('init/string', () => {
  test('@string can set property initialize to be number', () => {
    class Foo {
      @initNumber()
      bar = 1;
      @initNumber()
      car = 'car';
    }
    const foo = new Foo();
    expect(typeof foo.bar).toBe('number');
    expect(typeof foo.car).toBe('number');
  });
});
