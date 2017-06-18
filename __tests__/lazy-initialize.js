import {lazyInit, applyDecorators} from 'index';
describe('lazyInit', () => {
  test('descriptor cannot be undefined', () => {
    expect(() => applyDecorators(function () {}, {a: lazyInit})).toThrow('@lazyInit cannot be apply on undefined property.');
  });
  test('only accept datadescriptor', () => {
    const originConsole = console;
    global.console = Object.assign({}, originConsole, {warn: jest.fn()});
    class Foo {
      @lazyInit
      a () {}
      @lazyInit
      get b () {return 1;}
    }
    const foo = new Foo();
    expect(console.warn).toBeCalledWith("@lazyInit can only be used on property, but not methods and getter/setter.");
    expect(console.warn).toHaveBeenCalledTimes(2);
    global.console = originConsole;
  });
  test('lazyInit work on property', () => {
    const fn = jest.fn();
    class Foo {
      @lazyInit
      bar = fn();
    }
    const foo = new Foo();
    expect(fn).toHaveBeenCalledTimes(0);
    expect(foo.bar).toBe();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
