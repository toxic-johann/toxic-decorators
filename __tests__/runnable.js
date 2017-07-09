import {runnable, applyDecorators} from 'index';
describe('runnable', () => {
  let fn;
  let Foo;
  let Bar;
  let waiter;
  beforeEach(() => {
    fn = jest.fn();
    Foo = class Foo {
      waiter = waiter;
      flag = false;
      @runnable(function () {return waiter;})
      runByFunction (...args) {
        fn(...args);
      }
      @runnable(function () {return this.waiter;})
      runByLocalFunction (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
      @runnable(function () {return this.flag;})
      runByFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
    };
    Bar = class Bar {
      static flag = false;
      @runnable('flag')
      static useStaticFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
      @runnable('flag')
      useFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
      flag = false;
      _flag = false;
      get fnFlag () {
        return this._flag;
      }
      set fnFlag (value) {
        this._flag = value;
        return value;
      }
      @runnable('fnFlag')
      useFnFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
      static _fnFlag = false;
      static get fnFlag () {
        return this._fnFlag;
      }
      static set fnFlag (value) {
        this._fnFlag = value;
        return value;
      }
      @runnable('fnFlag')
      static useStaticFnFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
    };
  });
  afterEach(()=> {
    fn = null;
    Foo = null;
  });
  test('@runnable only accept Function or String', () => {
    expect(() => {
      return class {
        @runnable()
        foo () {}
      };
    }).toThrow('@runnable only accept Function or String');
  });
  test('run only when flag returned by function is true', () => {
    const foo = new Foo();
    foo.runByFlag(foo);
    expect(fn).toHaveBeenCalledTimes(0);
    foo.flag = true;
    expect(fn).toHaveBeenCalledTimes(0);
    foo.runByFlag(foo, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(foo, 1);
  });
  test('@runnable can only be used on function', () => {
    expect(() => {
      return class {
        @runnable(function () {})
        a = 2;
      };
    }).toThrow('@runnable can only be used on method, but not undefined on a');
  });
  test('run until the getter/setter flag on instance to be true', () => {
    const bar = new Bar();
    bar.useFnFlag(bar);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.fnFlag = true;
    expect(fn).toHaveBeenCalledTimes(0);
    bar.useFnFlag(bar, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(bar, 1);
  });
  test('run until the getter/setter flag on static prototype to be true', () => {
    Bar.useStaticFnFlag(Bar);
    expect(fn).toHaveBeenCalledTimes(0);
    Bar.fnFlag = true;
    expect(fn).toHaveBeenCalledTimes(0);
    Bar.useStaticFnFlag(Bar, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(Bar, 1);
  });
  test('run until the flag on instance to be true', () => {
    const bar = new Bar();
    bar.useFlag(bar);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(0);
    bar.useFlag(bar, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(bar, 1);
  });
  test('run until the flag on static prototype to be true', () => {
    Bar.useStaticFlag(Bar);
    expect(fn).toHaveBeenCalledTimes(0);
    Bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(0);
    Bar.useStaticFlag(Bar, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(Bar, 1);
  });
  test('reset flag again and have no waiting queue', () => {
    const bar = new Bar();
    bar.useFlag(bar);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(0);
    bar.useFlag(bar, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(bar, 1);
    bar.flag = false;
    bar.useFlag(bar, 2);
    expect(fn).toHaveBeenCalledTimes(1);
    bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test('@runnable can also rely on flag on other instance', () => {
    const fn = jest.fn();
    class Foo {
      flag = false;
    }
    const foo = new Foo();
    class Bar {
      @runnable('flag', {other: foo})
      run (...args) {
        expect(this).toBe(bar);
        fn(...args);
      }
    }
    const bar = new Bar();
    bar.run(1);
    expect(fn).toHaveBeenCalledTimes(0);
    foo.flag = true;
    expect(fn).toHaveBeenCalledTimes(0);
    bar.run(2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2);
  });
  test('@runnable can handle deep property', () => {
    const fn = jest.fn();
    class Bar {
      deepFlag = {
        you: {
          can: {
            run: false
          }
        }
      };
      @runnable('deepFlag.you.can.run')
      run (...args) {
        expect(this).toBe(bar);
        fn(...args);
      }
    }
    const bar = new Bar();
    bar.run(1);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.deepFlag.you.can.run = true;
    expect(fn).toHaveBeenCalledTimes(0);
    bar.run(2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2);
  });
  test('whatif the property do not exist.', () => {
    const fn = jest.fn();
    class Bar {
      @runnable('a.flag')
      run () {
        fn();
      }
    }
    const bar = new Bar();
    bar.run();
    expect(fn).toHaveBeenCalledTimes(0);
    bar.a = {};
    bar.run();
    expect(fn).toHaveBeenCalledTimes(0);
    bar.a.flag = true;
    bar.run();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test('throw error if descirptor is undefined', () => {
    class Foo {};
    expect(() => applyDecorators(Foo, {
      a: runnable('b')
    })).toThrow('@runnable must used on descriptor, are you using it on undefined property?');
  });
  test('you can pass in a backup function', () => {
    const fn = jest.fn();
    const fn1 = jest.fn();
    class Bar {
      @runnable(() => false, {backup: fn})
      a () {
        fn1();
      }
    }
    const bar = new Bar();
    bar.a();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(0);
  });
});
