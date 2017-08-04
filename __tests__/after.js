import {after, applyDecorators} from 'index';
describe('after', () => {
  test('throw error if descirptor is undefined', () => {
    class Foo {};
    expect(() => applyDecorators(Foo, {
      a: after(function () {})
    })).toThrow('@after can only be used on function, please checkout your property "a" is a method or not.');
  });
  test('@after only accept function parameter', () => {
    expect(() => {
      return class {
        @after(1)
        foo () {}
      };
    }).toThrow('@after only accept function parameter');
  });
  test('@after can only be used on function', () => {
    expect(() => {
      return class {
        @after(function () {})
        foo = 1;
      };
    }).toThrow('@after can only be used on function');
  });
  test('@after is a function return decorators', () => {
    expect(() => class {
      @after
      foo () {}
    }).toThrow('You may have used @after straightly. @after return decorators. You should call it before you use it as decorators');
  });
  test('test context and arguments in after function and final function', () => {
    const fn = jest.fn();
    const afterFn = jest.fn();
    class Foo {
      @after(function (value) {
        expect(value).toBe(this);
        afterFn(value);
        return value;
      }, function (value) {
        expect(value).toBe(this);
        afterFn(value);
        return value;
      })
      bar (...args) {
        expect(args[0]).toBe(this);
        fn(...args);
        return this;
      }
    }
    const foo = new Foo();
    expect(foo.bar(foo, 1, 2, 3)).toBe(foo);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(foo, 1, 2, 3);
    expect(afterFn).toHaveBeenCalledTimes(2);
    expect(afterFn).lastCalledWith(foo);
  });
  test('after accept at least one parameter', () => {
    expect(() => class {
      @after()
      foo () {}
    }).toThrow("@after accept at least one parameter. If you don't need to preprocess after your function, do not add @after decorators");
  });
  test('pass one parameter in @after', () => {
    const fn = jest.fn();
    class Foo {
      @after(val => {
        fn(val);
        return val;
      })
      bar (val) {
        return val;
      }
    };
    const foo = new Foo();
    expect(foo.bar(1)).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(1);
  });
  test('the function should be call after setter', () => {
    const result = [];
    class Foo {
      @after(() => result.push(2), () => result.push(3))
      bar () {
        result.push(1);
      }
    }
    const foo = new Foo();
    foo.bar();
    expect(result).toEqual([1, 2, 3]);
  });
});
