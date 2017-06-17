import waituntil from 'waituntil';
describe('waituntil', () => {
  let run;
  let fn;
  let Foo;
  let Bar;
  let waiter;
  beforeEach(() => {
    fn = jest.fn();
    waiter = new Promise(resolve => {run = resolve;});
    Foo = class Foo {
      waiter = waiter;
      flag = false;
      @waituntil(function () {return waiter;})
      runByFunction (...args) {
        fn(...args);
        // expect(this).toBe(args[0]);
      }
      @waituntil(function () {return this.waiter;})
      runByLocalFunction (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
      @waituntil(waiter)
      runByPromise (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
      @waituntil(function () {return this.flag;})
      runByFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
    };
    Bar = class Bar {
      static flag = false;
      @waituntil('flag')
      static useStaticFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
      @waituntil('flag')
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
      @waituntil('fnFlag')
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
      @waituntil('fnFlag')
      static useStaticFnFlag (...args) {
        fn(...args);
        expect(this).toBe(args[0]);
      }
    };
  });
  afterEach(()=> {
    run = null;
    fn = null;
    Foo = null;
  });
  test('@waitUntil only accept Function, Promise or String', () => {
    expect(() => {
      return class {
        @waituntil()
        foo () {}
      };
    }).toThrow('@waitUntil only accept Function, Promise or String');
  });
  test('wait until Promise resolved', async () => {
    const foo = new Foo();
    foo.runByPromise(foo);
    expect(fn).toHaveBeenCalledTimes(0);
    run();
    await waiter;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(foo);
    foo.runByPromise(foo, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    await waiter;
    expect(fn).toHaveBeenCalledTimes(2);
  });
  test('wait until promise returned by function resolved', async () => {
    const foo = new Foo();
    foo.runByFunction(foo);
    expect(fn).toHaveBeenCalledTimes(0);
    run();
    await waiter;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(foo);
    foo.runByFunction(foo, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    await waiter;
    expect(fn).toHaveBeenCalledTimes(2);
  });
  test('wait until promise on instance returen by function resolved', async () => {
    const foo = new Foo();
    foo.runByLocalFunction(foo);
    expect(fn).toHaveBeenCalledTimes(0);
    run();
    await waiter;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(foo);
    foo.runByLocalFunction(foo, 1);
    expect(fn).toHaveBeenCalledTimes(1);
    await waiter;
    expect(fn).toHaveBeenCalledTimes(2);
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
  test('@waituntil can only be used on function', () => {
    expect(() => {
      return class {
        @waituntil(function () {})
        a = 2;
      };
    }).toThrow('@waituntil can only be used on function, but not undefined');
  });
  test('wait until the getter/setter flag on instance to be true', () => {
    const bar = new Bar();
    bar.useFnFlag(bar);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.fnFlag = true;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(bar);
    bar.useFnFlag(bar, 1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(bar, 1);
  });
  test('wait until the getter/setter flag on static prototype to be true', () => {
    Bar.useStaticFnFlag(Bar);
    expect(fn).toHaveBeenCalledTimes(0);
    Bar.fnFlag = true;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(Bar);
    Bar.useStaticFnFlag(Bar, 1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(Bar, 1);
  });
  test('wait until the flag on instance to be true', () => {
    const bar = new Bar();
    bar.useFlag(bar);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(bar);
    bar.useFlag(bar, 1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(bar, 1);
  });
  test('wait until the flag on static prototype to be true', () => {
    Bar.useStaticFlag(Bar);
    expect(fn).toHaveBeenCalledTimes(0);
    Bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(Bar);
    Bar.useStaticFlag(Bar, 1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(Bar, 1);
  });
  test('reset flag again and do not called the old function in waiting queue', () => {
    const bar = new Bar();
    bar.useFlag(bar);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(bar);
    bar.useFlag(bar, 1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(bar, 1);
    bar.flag = false;
    bar.useFlag(bar, 2);
    expect(fn).toHaveBeenCalledTimes(2);
    bar.flag = true;
    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn).lastCalledWith(bar, 2);
  });
  test('@waituntil can also rely on flag on other instance', () => {
    const fn = jest.fn();
    class Foo {
      flag = false;
    }
    const foo = new Foo();
    class Bar {
      @waituntil('flag', foo)
      run (...args) {
        expect(this).toBe(bar);
        fn(...args);
      }
    }
    const bar = new Bar();
    bar.run(1);
    expect(fn).toHaveBeenCalledTimes(0);
    foo.flag = true;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(1);
    bar.run(2);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(2);
  });
  test('@waituntil can handle deep property', () => {
    const fn = jest.fn();
    class Bar {
      deepFlag = {
        you: {
          can: {
            run: false
          }
        }
      };
      @waituntil('deepFlag.you.can.run')
      run (...args) {
        expect(this).toBe(bar);
        fn(...args);
      }
    }
    const bar = new Bar();
    bar.run(1);
    expect(fn).toHaveBeenCalledTimes(0);
    bar.deepFlag.you.can.run = true;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(1);
    bar.run(2);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(2);
  });
  test('whatif the property do not exist.', () => {
    const fn = jest.fn();
    class Bar {
      @waituntil('a.flag')
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
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
