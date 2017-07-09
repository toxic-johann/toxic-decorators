import {accessor, applyDecorators} from 'index';
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
    };
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
  test('@accessor can also handle getter and setter well even you just pass a get', () => {
    const fn = jest.fn();
    const get = function (value) {
      fn();
      return value;
    };
    let value = 1;
    class Foo {
      @accessor({get})
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
    expect(fn).toHaveBeenCalledTimes(1);
    expect(foo.bar).toBe(value);
    expect(foo.bar).toBe(2);
  });
  test('@accessor can also handle getter and setter well even you just pass a set', () => {
    const fn = jest.fn();
    const set = function (value) {
      fn();
      return value;
    };
    let value = 1;
    class Foo {
      @accessor({set})
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
    expect(fn).toHaveBeenCalledTimes(0);
    foo.bar = 2;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(foo.bar).toBe(value);
    expect(foo.bar).toBe(2);
  });
  test('@accessor will warn if you pass it a setter function and offer it a accessor without setter, but it still do a good job', () => {
    const fn = jest.fn();
    const originConsole = console;
    global.console = Object.assign({}, originConsole, {warn: jest.fn()});
    const get = function (value) {
      fn();
      return value;
    };
    const set = get;
    const value = 1;
    class Foo {
      @accessor({get, set})
      get bar () {
        return value;
      }
    };
    const foo = new Foo();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).lastCalledWith("You are trying to set setter via @accessor on  bar without setter. That's not a good idea.");
    expect(foo.bar).toBe(value);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(() => {foo.bar = 2;}).not.toThrow();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(foo.bar).toBe(value);
    expect(foo.bar).toBe(1);
    global.console = originConsole;
  });
  test('@accessor will warn if you pass it a getter function and offer it a accessor without getter, but it still do a good job', () => {
    const fn = jest.fn();
    const originConsole = console;
    global.console = Object.assign({}, originConsole, {warn: jest.fn()});
    const get = function (value) {
      fn();
      return value;
    };
    const set = get;
    let value = 1;
    class Foo {
      @accessor({get, set})
      set bar (val) {
        value = val;
        return value;
      }
    };
    const foo = new Foo();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).lastCalledWith("You are trying to set getter via @accessor on bar without getter. That's not a good idea.");
    expect(foo.bar).toBe(undefined);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(() => {foo.bar = 2;}).not.toThrow();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(foo.bar).toBe(undefined);
    expect(value).toBe(2);
    global.console = originConsole;
  });
  test('@accessor can just modify descriptor with only getter as you offet get', () => {
    const fn = jest.fn();
    const get = function (value) {
      fn();
      return value;
    };
    const value = 1;
    class Foo {
      @accessor({get})
      get bar () {
        return value;
      }
    };
    const foo = new Foo();
    expect(foo.bar).toBe(value);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(() => {foo.bar = 2;}).toThrow('Cannot set property bar of #<Foo> which has only a getter');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(foo.bar).toBe(value);
    expect(foo.bar).toBe(1);
  });
  test('@accessor can just modify descriptor with only setter as you offet set', () => {
    const fn = jest.fn();
    const set = function (value) {
      fn();
      return value;
    };
    let value = 1;
    class Foo {
      @accessor({set})
      set bar (val) {
        value = val;
        return value;
      }
    };
    const foo = new Foo();
    expect(foo.bar).toBe(undefined);
    expect(fn).toHaveBeenCalledTimes(0);
    expect(() => {foo.bar = 2;}).not.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(foo.bar).toBe(undefined);
    expect(value).toBe(2);
  });
  test('@accessor alse accept array of funtion as getter/setter', () => {
    const fn = jest.fn();
    const handler = function (value) {
      fn(value);
      expect(this).toBe(foo);
      return value;
    };
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
  test('@accessor can accessor undefined', () => {
    let value = 1;
    class Foo {};
    applyDecorators(Foo, {
      a: accessor({
        get () {return value;},
        set (val) {
          value = val;
          return value;
        }
      })
    });
    const foo = new Foo();
    expect(foo.a).toBe(value);
    foo.a = 2;
    expect(foo.a).toBe(value);
    expect(value).toBe(2);
  });
  describe('preSet and preGet in getter/setter', () => {
    let result;
    class Foo {
      @accessor({
        get (val) {
          result.push(2);
          return val;
        },
        set (val) {
          result.push(4);
          return val;
        }
      }, {preGet: true, preSet: true})
      get a () {
        result.push(1);
        return 'a';
      }
      set a (value) {
        result.push(3);
      }
      @accessor({
        get (val) {
          result.push(2);
          return val;
        },
        set (val) {
          result.push(4);
          return val;
        }
      }, {preGet: false, preSet: false})
      get b () {
        result.push(1);
        return 'b';
      }
      set b (value) {
        result.push(3);
      }
    }
    const foo = new Foo();
    beforeEach(() => {
      result = [];
    });
    test('pre is true', () => {
      expect(foo.a).toBe('a');
      foo.a = 1;
      expect(result).toEqual([2, 1, 4, 3])
    });
    test('pre is false', () => {
      expect(foo.b).toBe('b');
      foo.b = 2;
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });
  describe('preset in intialize descriptor', () => {
    let result;
    class Foo {
      @accessor({
        set () {
          result.push(this.a);
        }
      }, {preSet: false})
      a = 1;
      @accessor({
        set () {
          result.push(this.b);
        }
      }, {preSet: true})
      b = 1;
    }
    const foo = new Foo();
    beforeEach(() => {
      result = [];
    });
    test('preset is false', () => {
      foo.a = 2;
      expect(result[0]).toBe(2);
    });
    test('preset is true', () => {
      foo.b = 2;
      expect(result[0]).toBe(1);
    });
  });
  describe('preset on data descriptor', () => {
    let result;
    class Foo {
      @accessor({
        set () {
          result.push(this.a())
        }
      }, {preSet: false})
      a () {return 1;}
      @accessor({
        set () {
          result.push(this.b())
        }
      }, {preSet: true})
      b () {return 1;}
    }
    const foo = new Foo();
    beforeEach(()=> {
      result = [];
    });
    test('preset is false', () => {
      foo.a = () => 2;
      expect(result[0]).toBe(2);
    });
    test('preset is true', () => {
      foo.b = () => 2;
      expect(result[0]).toBe(1);
    });
  });
});
