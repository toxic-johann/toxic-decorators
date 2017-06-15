import accessor from 'accessor';
describe('accessor', () => {
  test('@accessor must accept a getter or setter', () => {
    expect(() => class {
      @accessor()
      foo () {}
    }).toThrow("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
  });
  test('@accessor can change a data property into accessor property', () => {
    const fn = jest.fn();
    const get = function (value) {
      fn(value);
      return value;
    };
    const set = get;
    class Foo {
      @accessor({get, set})
      bar = 1;
    }
    const foo = new Foo();
    expect(foo.bar).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(1);
    foo.bar = 2;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(foo.bar).toBe(2);
    expect(fn).lastCalledWith(2);
  });
  test('@accessor called function with instance', () => {
    const get = function (value) {
      expect(this).toBe(foo);
      return value;
    }
    const set = get;
    class Foo {
      @accessor({get, set})
      bar = 1;
    }
    const foo = new Foo();
    foo.bar = 2;
  });
  test('@accessor can handle function property', () => {
    const run = jest.fn();
    const operate = jest.fn();
    const get = function (value) {
      operate();
      return function () {
        run();
        value();
      };
    };
    const set = get;
    class Foo {
      @accessor({get, set})
      bar () {}
    }
    const foo = new Foo();
    const bar = foo.bar;
    expect(run).toHaveBeenCalledTimes(0);
    expect(operate).toHaveBeenCalledTimes(1);
    bar();
    expect(run).toHaveBeenCalledTimes(1);
    expect(operate).toHaveBeenCalledTimes(1);
    foo.bar = function () {};
    expect(run).toHaveBeenCalledTimes(1);
    expect(operate).toHaveBeenCalledTimes(2);
    foo.bar();
    expect(run).toHaveBeenCalledTimes(3);
    expect(operate).toHaveBeenCalledTimes(3);
  });
  test('@accessor can also handle getter and setter well', () => {
    const fn = jest.fn();
    const get = function (value) {
      fn();
      return value;
    };
    const set = get;
    let value = 1;
    class Foo {
      @accessor({get, set})
      get bar () {
        return value;
      }
      set bar (val) {
        value = val;
        return value;
      }
    };
    const foo = new Foo();
    expect(foo.bar).toBe(value);
    expect(fn).toHaveBeenCalledTimes(1);
    foo.bar = 2;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(foo.bar).toBe(value);
    expect(foo.bar).toBe(2);
  });
  test('@accessor alse accept array of funtion as getter/setter', () => {
    const fn = jest.fn();
    const handler = function (value) {
      fn(value);
      expect(this).toBe(foo);
      return value;
    }
    const get = [handler, handler];
    const set = get;
    class Foo {
      @accessor({get, set})
      bar = 1;
    }
    const foo = new Foo();
    expect(foo.bar).toBe(1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(1);
    foo.bar = 2;
    expect(fn).toHaveBeenCalledTimes(4);
    expect(fn).lastCalledWith(2);
    expect(foo.bar).toBe(2);
  });
  test('@accessor will throw error when they accept illgal array', () => {
    expect(() => class {
      @accessor({get: []})
      bar = 1;
    }).toThrow("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
    expect(() => class {
      @accessor({set: []})
      bar = 1;
    }).toThrow("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
    expect(() => class {
      @accessor({get: [1]})
      bar = 1;
    }).toThrow('@accessor only accept function or array of function as getter/setter');
    expect(() => class {
      @accessor({get: [() => {}, 1]})
      bar = 1;
    }).toThrow('@accessor only accept function or array of function as getter/setter');
  });
  test('@accessor accept one function in the array, though we do not courage people to do this', () => {
    const fn = jest.fn();
    const handler = function (value) {
      fn(value);
      expect(this).toBe(foo);
      return value;
    };
    class Foo {
      @accessor({get: [handler], set: [handler]})
      bar = 1;
    }
    const foo = new Foo();
    expect(foo.bar).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(1);
    foo.bar = 2;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(foo.bar).toBe(2);
    expect(fn).lastCalledWith(2);
  });
});
