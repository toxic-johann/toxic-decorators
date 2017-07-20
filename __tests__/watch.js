import {watch, applyDecorators} from 'index';
describe('watch', () => {
  test('key or function as first parameter', () => {
    expect(() => class {
      @watch()
      a = 1;
    }).toThrow('You must pass a function or a string to find the hanlder function.');
  });
  test('You can only pass function or string as handler in one parameter situation', () => {
    expect(() => class {
      @watch({})
      a = 1;
    }).toThrow('You can only pass function or string as handler');
  });
  test('You can only pass function or string as handler in multiple parameter situation', () => {
    expect(() => class {
      @watch({}, {})
      a = 1;
    }).toThrow('You can only pass function or string as handler');
  });
  test('other must be an legal instance', () => {
    expect(() => class {
      @watch('123', {other: 123})
      a = 1;
    }).toThrow('If you want us to trigger function on the other instance, you must pass in a legal instance');
  });
  test('You can pass in the function on some instance by string, but please make sure the function exist', () => {
    class Foo {
      @watch('b')
      a = 1
    }
    const foo = new Foo();
    expect(() => {foo.a = 3;}).toThrow('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
  });
  test('you can omit the illegal other instance error', () => {
    class Foo {
      @watch('b', {omit: true})
      a = 1
    }
    const foo = new Foo();
    expect(() => {foo.a = 3;}).not.toThrow();
  });
  test('deep on non-object property', () => {
    const fn = jest.fn();
    class Foo {
      @watch(fn, {deep: true})
      a = 1
    }
    const foo = new Foo();
    expect(() => {foo.a = 3;}).not.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(3, 1);
  });
  test('we can watch a single property', () => {
    const fn = jest.fn();
    class Foo {
      @watch(function (...args) {
        expect(this).toBe(foo);
        fn(...args);
      })
      a = 1;
    }
    const foo = new Foo();
    expect(foo.a).toBe(1);
    foo.a = 2;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2, 1);
    expect(foo.a).toBe(2);
    foo.a = 3;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(3, 2);
    expect(foo.a).toBe(3);
  });
  test("we won't trigger the function when the oldval is the same as new value", () => {
    const fn = jest.fn();
    class Foo {
      @watch(function (...args) {
        expect(this).toBe(foo);
        fn(...args);
      })
      a = 1;
    }
    const foo = new Foo();
    expect(foo.a).toBe(1);
    foo.a = 1;
    expect(fn).toHaveBeenCalledTimes(0);
    expect(foo.a).toBe(1);
    foo.a = 3;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(3, 1);
    expect(foo.a).toBe(3);
  });
  test('we willt trigger the function when the oldval is the same as new value if you set diff false', () => {
    const fn = jest.fn();
    class Foo {
      @watch(function (...args) {
        expect(this).toBe(foo);
        fn(...args);
      }, {diff: false})
      a = 1;
    }
    const foo = new Foo();
    expect(foo.a).toBe(1);
    foo.a = 1;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(1, 1);
    expect(foo.a).toBe(1);
    foo.a = 3;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(3, 1);
    expect(foo.a).toBe(3);
  });
  describe('deep diff', () => {
    let foo;
    let Foo;
    let fn;
    beforeEach(() => {
      fn = jest.fn();
      Foo = class Foo {
        @watch(fn, {deep: true})
        a = {
          baz: {
            bar: 1
          }
        }
        @watch(fn, {deep: true, diff: false})
        b = {
          baz: {
            bar: 1
          }
        }
        @watch(fn, {deep: true, proxy: true})
        c = {
          baz: {
            bar: 1
          }
        }
        @watch(fn, {deep: true, diff: false, proxy: true})
        d = {
          baz: {
            bar: 1
          }
        }
      };
      foo = new Foo();
    });
    test('deep observe', () => {
      expect(foo.a.baz.bar).toBe(1);
      foo.a.baz.bar = 1;
      expect(fn).toHaveBeenCalledTimes(0);
      foo.a.baz.bar = 2;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.a, foo.a);
      expect(foo.a.baz.bar).toBe(2);
    });
    test('deep observer but without diff', () => {
      expect(foo.b.baz.bar).toBe(1);
      foo.b.baz.bar = 1;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.b, foo.b);
      expect(foo.b.baz.bar).toBe(1);
      foo.b.baz.bar = 2;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.b, foo.b);
      expect(foo.b.baz.bar).toBe(2);
    });
    test('deep proxy', () => {
      expect(foo.c.baz.bar).toBe(1);
      foo.c.baz.bar = 1;
      expect(fn).toHaveBeenCalledTimes(0);
      foo.c.baz.bar = 2;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.c, foo.c);
      expect(foo.c.baz.bar).toBe(2);
    });
    test('deep proxy but without diff', () => {
      expect(foo.d.baz.bar).toBe(1);
      foo.d.baz.bar = 1;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.d, foo.d);
      expect(foo.d.baz.bar).toBe(1);
      foo.d.baz.bar = 2;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.d, foo.d);
      expect(foo.d.baz.bar).toBe(2);
    });
  });
  test('we can watch a single property on the function indicate by string', () => {
    const fn = jest.fn();
    class Foo {
      @watch('b')
      a = 1;
      b (...args) {
        expect(this).toBe(foo);
        fn(...args);
      }
    }
    const foo = new Foo();
    expect(foo.a).toBe(1);
    foo.a = 2;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2, 1);
    expect(foo.a).toBe(2);
    foo.a = 3;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(3, 2);
    expect(foo.a).toBe(3);
  });
  test('we can watch on a getter/setter', () => {
    let value = 1;
    const fn = jest.fn();
    class Foo {
      @watch(function (...args) {
        expect(this).toBe(foo);
        fn(...args);
      })
      get a () {return value;}
      set a (val) {
        value = val;
        return value;
      }
    }
    const foo = new Foo();
    expect(foo.a).toBe(1);
    foo.a = 2;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2, 1);
    expect(foo.a).toBe(2);
    foo.a = 3;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).lastCalledWith(3, 2);
    expect(foo.a).toBe(3);
  });
  describe('we can watch on a object deeply', () => {
    let fn;
    let foo;
    const g = {};
    Object.defineProperty(g, 'h', {
      value: 1,
      writable: false
    });
    Object.defineProperty(g, 'i', {
      value: 1,
      configurable: false
    });
    beforeEach(() => {
      fn = jest.fn();
      class Foo {
        @watch(fn, {deep: true})
        bar = {
          a: 1,
          b: {
            c: 2
          },
          d: {
            e: {
              f: 3
            }
          },
          g,
          l: [1, 2, 3, 4]
        }
      };
      foo = new Foo();
    });
    test('we can watch the object before you reset it', () => {
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we can watch the object after you reset', () => {
      const oldFooBar = foo.bar;
      foo.bar = {
        a: 1,
        b: {
          c: 2
        },
        d: {
          e: {
            f: 3
          }
        }
      };
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, oldFooBar);
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we would do nothing if that value is static or nonconfiguarable', () => {
      expect(foo.bar.g.i).toBe(1);
      expect(foo.bar.g.h).toBe(1);
    });
    describe('we can intercept new add property', () => {
      test('deep add', () => {
        foo.bar.b.__set('d', 3);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
      test('normal add', () => {
        foo.bar.__set('baz', {a: 1, b: 2});
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
      test('already set', () => {
        foo.bar.b.__set('c', 7);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
    });
    describe('we can intercept delete property', () => {
      test('normal delete', () => {
        foo.bar.__del('a');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(foo.bar.a).toBe();
      });
      test('deep delete', () => {
        foo.bar.b.__del('c');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
      test('set after delete', () => {
        foo.bar.__del('a');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(foo.bar.a).toBe();
        foo.bar.__set('a', 3);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(foo.bar.a).toBe(3);
      });
    });
    test('we can watch the array too', () => {
      foo.bar.l[0] = 4;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(4);
    });
    test('array set should trigger method', () => {
      foo.bar.l.__set('4', 8);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(8);
    });
    test('array delete should trigger method', () => {
      foo.bar.l.__del('4');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe();
    });
    test('array delete then set should trigger method', () => {
      foo.bar.l.__del('4');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe();
      foo.bar.l.__set('4', 7);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(7);
    });
    test('array push should trigger method', () => {
      foo.bar.l.push(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(3);
    });
    test('array pop should trigger method', () => {
      foo.bar.l.pop();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array unshift should trigger method', () => {
      foo.bar.l.unshift(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(3);
    });
    test('array shift should trigger method', () => {
      foo.bar.l.shift();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array splice should trigger method', () => {
      foo.bar.l.splice(2, 2, 5, 6);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([1, 2, 5, 6]);
    });
    test('array reverse should trigger method', () => {
      foo.bar.l.reverse();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('array sort should trigger method', () => {
      foo.bar.l = [1, 3, 4, 2];
      expect(fn).toHaveBeenCalledTimes(1);
      foo.bar.l.sort((a, b) => b - a);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('modify new push value, it still trigger method', () => {
      foo.bar.l.push(3);
      foo.bar.l[4] = 7;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(7);
    });
  });
  describe('we can watch on a object deeply by proxy', () => {
    let fn;
    let foo;
    const g = {};
    Object.defineProperty(g, 'h', {
      value: 1,
      writable: false
    });
    Object.defineProperty(g, 'i', {
      value: 1,
      configurable: false
    });
    beforeEach(() => {
      fn = jest.fn();
      class Foo {
        @watch(fn, {deep: true, proxy: true})
        bar = {
          a: 1,
          b: {
            c: 2
          },
          d: {
            e: {
              f: 3
            }
          },
          g,
          l: [1, 2, 3, 4]
        }
      };
      foo = new Foo();
    });
    test('we can watch the object before you reset it', () => {
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we can watch the object after you reset', () => {
      const oldFooBar = foo.bar;
      foo.bar = {
        a: 1,
        b: {
          c: 2
        },
        d: {
          e: {
            f: 3
          }
        }
      };
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, oldFooBar);
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we would do nothing if that value is static or nonconfiguarable', () => {
      expect(foo.bar.g.i).toBe(1);
      expect(foo.bar.g.h).toBe(1);
    });
    describe('we can intercept new add property', () => {
      test('deep add', () => {
        foo.bar.b.d = 3;
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
      test('normal add', () => {
        foo.bar.baz = {a: 1, b: 2};
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
    });
    describe('we can intercept delete property', () => {
      test('normal delete', () => {
        delete foo.bar.a;
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
      test('deep delete', () => {
        delete foo.bar.b.c;
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
      });
    });
    test('we can watch the array too', () => {
      foo.bar.l[0] = 4;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(4);
    });
    test('array set should trigger method', () => {
      foo.bar.l[4] = 8;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(8);
    });
    test('array delete should trigger method', () => {
      delete foo.bar.l[4];
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe();
    });
    test('array push should trigger method', () => {
      foo.bar.l.push(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(3);
    });
    test('array pop should trigger method', () => {
      foo.bar.l.pop();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array unshift should trigger method', () => {
      foo.bar.l.unshift(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(3);
    });
    test('array shift should trigger method', () => {
      foo.bar.l.shift();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array splice should trigger method', () => {
      foo.bar.l.splice(2, 2, 5, 6);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([1, 2, 5, 6]);
    });
    test('array reverse should trigger method', () => {
      foo.bar.l.reverse();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('array sort should trigger method', () => {
      foo.bar.l = [1, 3, 4, 2];
      expect(fn).toHaveBeenCalledTimes(1);
      foo.bar.l.sort((a, b) => b - a);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('modify new push value, it still trigger method', () => {
      foo.bar.l.push(3);
      foo.bar.l[4] = 7;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(7);
    });
  });
  describe('multiple watch', () => {
    test('watch both obj and subobject without proxy', () => {
      const obj = {
        a: {
          b: {
            c: 1
          }
        }
      };
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      applyDecorators(obj, {
        a: watch(fn1, {deep: true})
      }, {self: true});
      applyDecorators(obj.a, {
        b: watch(fn2, {deep: true})
      }, {self: true});
      obj.a.b.c = 2;
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn1).lastCalledWith(obj.a, obj.a);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(fn2).lastCalledWith(obj.a.b, obj.a.b);
    });
    test('watch both obj and subobject by proxy', () => {
      const obj = {
        a: {
          b: {
            c: 1
          }
        }
      };
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      applyDecorators(obj, {
        a: watch(fn1, {deep: true, proxy: true})
      }, {self: true});
      applyDecorators(obj.a, {
        b: watch(fn2, {deep: true, proxy: true})
      }, {self: true});
      obj.a.b.c = 2;
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn1).lastCalledWith(obj.a, obj.a);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(fn2).lastCalledWith(obj.a.b, obj.a.b);
    });
  });
  describe('we can multiple watch on a object deeply', () => {
    let fn;
    let fn1;
    let foo;
    const g = {};
    Object.defineProperty(g, 'h', {
      value: 1,
      writable: false
    });
    Object.defineProperty(g, 'i', {
      value: 1,
      configurable: false
    });
    beforeEach(() => {
      fn = jest.fn();
      fn1 = jest.fn();
      class Foo {
        @watch(fn, {deep: true})
        @watch(fn1, {deep: true})
        bar = {
          a: 1,
          b: {
            c: 2
          },
          d: {
            e: {
              f: 3
            }
          },
          g,
          l: [1, 2, 3, 4]
        }
      };
      foo = new Foo();
    });
    test('we can watch the object before you reset it', () => {
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn1).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we can watch the object after you reset', () => {
      const oldFooBar = foo.bar;
      foo.bar = {
        a: 1,
        b: {
          c: 2
        },
        d: {
          e: {
            f: 3
          }
        }
      };
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).lastCalledWith(foo.bar, oldFooBar);
      expect(fn).lastCalledWith(foo.bar, oldFooBar);
      expect(fn1).lastCalledWith(foo.bar, oldFooBar);
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn1).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn1).toHaveBeenCalledTimes(4);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we would do nothing if that value is static or nonconfiguarable', () => {
      expect(foo.bar.g.i).toBe(1);
      expect(foo.bar.g.h).toBe(1);
    });
    describe('we can intercept new add property', () => {
      test('deep add', () => {
        foo.bar.b.__set('d', 3);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
      });
      test('normal add', () => {
        foo.bar.__set('baz', {a: 1, b: 2});
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
      });
    });
    describe('we can intercept delete property', () => {
      test('normal delete', () => {
        foo.bar.__del('a');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
        expect(foo.bar.a).toBe();
      });
      test('deep delete', () => {
        foo.bar.b.__del('c');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
      });
      test('set after delete', () => {
        foo.bar.__del('a');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
        expect(foo.bar.a).toBe();
        foo.bar.__set('a', 3);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn1).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
        expect(foo.bar.a).toBe(3);
      });
    });
    test('we can watch the array too', () => {
      foo.bar.l[0] = 4;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(4);
    });
    test('array set should trigger method', () => {
      foo.bar.l.__set('4', 8);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(8);
    });
    test('array delete should trigger method', () => {
      foo.bar.l.__del('4');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe();
    });
    test('array delete then set should trigger method', () => {
      foo.bar.l.__del('4');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe();
      foo.bar.l.__set('4', 7);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(7);
    });
    test('array push should trigger method', () => {
      foo.bar.l.push(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(3);
    });
    test('array pop should trigger method', () => {
      foo.bar.l.pop();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array unshift should trigger method', () => {
      foo.bar.l.unshift(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(3);
    });
    test('array shift should trigger method', () => {
      foo.bar.l.shift();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array splice should trigger method', () => {
      foo.bar.l.splice(2, 2, 5, 6);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([1, 2, 5, 6]);
    });
    test('array reverse should trigger method', () => {
      foo.bar.l.reverse();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('array sort should trigger method', () => {
      foo.bar.l = [1, 3, 4, 2];
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      foo.bar.l.sort((a, b) => b - a);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('modify new push value, it still trigger method', () => {
      foo.bar.l.push(3);
      foo.bar.l[4] = 7;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(7);
    });
  });
  describe('we can multiple watch on a object deeply by proxy', () => {
    let fn;
    let fn1;
    let foo;
    const g = {};
    Object.defineProperty(g, 'h', {
      value: 1,
      writable: false
    });
    Object.defineProperty(g, 'i', {
      value: 1,
      configurable: false
    });
    beforeEach(() => {
      fn = jest.fn();
      fn1 = jest.fn();
      class Foo {
        @watch(fn1, {deep: true, proxy: true})
        @watch(fn, {deep: true, proxy: true})
        bar = {
          a: 1,
          b: {
            c: 2
          },
          d: {
            e: {
              f: 3
            }
          },
          g,
          l: [1, 2, 3, 4]
        }
      };
      foo = new Foo();
    });
    test('we can watch the object before you reset it', () => {
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn1).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we can watch the object after you reset', () => {
      const oldFooBar = foo.bar;
      foo.bar = {
        a: 1,
        b: {
          c: 2
        },
        d: {
          e: {
            f: 3
          }
        }
      };
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, oldFooBar);
      expect(fn1).lastCalledWith(foo.bar, oldFooBar);
      foo.bar.a = 2;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.a).toBe(2);
      foo.bar.b.c = 3;
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn1).toHaveBeenCalledTimes(3);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.b.c).toBe(3);
      foo.bar.d.e.f = 4;
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn1).toHaveBeenCalledTimes(4);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.d.e.f).toBe(4);
    });
    test('we would do nothing if that value is static or nonconfiguarable', () => {
      expect(foo.bar.g.i).toBe(1);
      expect(foo.bar.g.h).toBe(1);
    });
    describe('we can intercept new add property', () => {
      test('deep add', () => {
        foo.bar.b.d = 3;
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
      });
      test('normal add', () => {
        foo.bar.baz = {a: 1, b: 2};
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
      });
    });
    describe('we can intercept delete property', () => {
      test('normal delete', () => {
        delete foo.bar.a;
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
      });
      test('deep delete', () => {
        delete foo.bar.b.c;
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(fn1).lastCalledWith(foo.bar, foo.bar);
      });
    });
    test('we can watch the array too', () => {
      foo.bar.l[0] = 4;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(4);
    });
    test('array set should trigger method', () => {
      foo.bar.l[4] = 8;
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(8);
    });
    test('array delete should trigger method', () => {
      delete foo.bar.l[4];
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe();
    });
    test('array push should trigger method', () => {
      foo.bar.l.push(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(3);
    });
    test('array pop should trigger method', () => {
      foo.bar.l.pop();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array unshift should trigger method', () => {
      foo.bar.l.unshift(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[0]).toBe(3);
    });
    test('array shift should trigger method', () => {
      foo.bar.l.shift();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l.length).toBe(3);
    });
    test('array splice should trigger method', () => {
      foo.bar.l.splice(2, 2, 5, 6);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([1, 2, 5, 6]);
    });
    test('array reverse should trigger method', () => {
      foo.bar.l.reverse();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('array sort should trigger method', () => {
      foo.bar.l = [1, 3, 4, 2];
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
      foo.bar.l.sort((a, b) => b - a);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l).toEqual([4, 3, 2, 1]);
    });
    test('modify new push value, it still trigger method', () => {
      foo.bar.l.push(3);
      foo.bar.l[4] = 7;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(foo.bar, foo.bar);
      expect(fn1).lastCalledWith(foo.bar, foo.bar);
      expect(foo.bar.l[4]).toBe(7);
    });
  });
  describe('mutlpe watch order', () => {
    let result;
    let fn, fn1, fn2;
    beforeEach(() => {
      result = [];
      fn = jest.fn();
      fn1 = (...args) => {
        fn(...args);
        result.push(1);
      };
      fn2 = (...args) => {
        fn(...args);
        result.push(2);
      };
    });
    test('normal change', () => {
      class Foo {
        @watch(fn2)
        @watch(fn1)
        bar = 1;
      }
      const foo = new Foo();
      foo.bar = 2;
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).lastCalledWith(2, 1);
      expect(result).toEqual([1, 2]);
      expect(foo.bar).toBe(2);
    });
    describe('deep with observe', () => {
      let Foo;
      let foo;
      beforeEach(() => {
        Foo = class Foo {
          @watch(fn2, {deep: true})
          @watch(fn1, {deep: true})
          bar = {
            a: 1
          };
          @watch(fn2, {deep: true})
          @watch(fn1, {deep: true})
          baz = [1, 2, 3];
        };
        foo = new Foo();
      });
      test('deep change', () => {
        foo.bar.a = 2;
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(result).toEqual([1, 2]);
      });
      test('deep new set', () => {
        foo.bar.__set('b', 2);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(result).toEqual([1, 2]);
      });
      test('deep delete', () => {
        foo.bar.__del('a');
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(result).toEqual([1, 2]);
      });
      test('deep array change', () => {
        foo.baz.push(4);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.baz, foo.baz);
        expect(result).toEqual([1, 2]);
      });
    });
    describe('deep with proxy', () => {
      let Foo;
      let foo;
      beforeEach(() => {
        Foo = class Foo {
          @watch(fn2, {deep: true, proxy: true})
          @watch(fn1, {deep: true, proxy: true})
          bar = {
            a: 1
          };
          @watch(fn2, {deep: true, proxy: true})
          @watch(fn1, {deep: true, proxy: true})
          baz = [1, 2, 3];
        };
        foo = new Foo();
      });
      test('deep change with proxy', () => {
        foo.bar.a = 2;
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(result).toEqual([1, 2]);
      });
      test('deep new set with proxy', () => {
        foo.bar.b = 2;
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(result).toEqual([1, 2]);
      });
      test('deep delete with proxy', () => {
        delete foo.bar.a;
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.bar, foo.bar);
        expect(result).toEqual([1, 2]);
      });
      test('deep array change', () => {
        foo.baz.push(4);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).lastCalledWith(foo.baz, foo.baz);
        expect(result).toEqual([1, 2]);
      });
    });
  });
});
