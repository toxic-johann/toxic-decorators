import { before, applyDecorators } from 'index';
describe('before', () => {
  test('throw error if descirptor is undefined', () => {
    class Foo {}
    expect(() => applyDecorators(Foo, {
      a: before(function() {}),
    })).toThrow('@before can only be used on function, please check the property "a" is a method or not.');
  });
  test('@before only accept function parameter', () => {
    expect(() => {
      return class {
        @before(1)
        foo() {}
      };
    }).toThrow('@before only accept function parameter');
  });
  test('@before can only be used on function', () => {
    expect(() => {
      return class {
        @before(function() {})
        foo = 1;
      };
    }).toThrow('@before can only be used on function');
  });
  test('@before is a function return decorators', () => {
    expect(() => class {
      @before
      foo() {}
    }).toThrow('You may use @before straightly, @before return decorators, you should call it before you set it as decorator.');
  });
  test('test context and arguments in before function and final function', () => {
    const fn = jest.fn();
    const beforeFn = jest.fn();
    class Foo {
      @before(function(...args) {
        expect(args[0]).toBe(this);
        beforeFn(...args);
        return args;
      }, function(...args) {
        expect(args[0]).toBe(this);
        beforeFn(...args);
      })
      bar(...args) {
        expect(args[0]).toBe(this);
        fn(...args);
        return this;
      }
    }
    const foo = new Foo();
    expect(foo.bar(foo, 1, 2, 3)).toBe(foo);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(foo, 1, 2, 3);
    expect(beforeFn).toHaveBeenCalledTimes(2);
    expect(beforeFn).lastCalledWith(foo, 1, 2, 3);
  });
  test('before accept at least one parameter', () => {
    expect(() => class {
      @before()
      foo() {}
    }).toThrow("@before accept at least one parameter. If you don't need to preprocess before your function, do not add @before decorators");
  });
  test('pass one parameter in @before', () => {
    const fn = jest.fn();
    class Foo {
      @before(val => {
        fn(val);
        return val;
      })
      bar(val) {
        return val;
      }
    }
    const foo = new Foo();
    expect(foo.bar(1)).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(1);
  });
  test('the function should be call before setter', () => {
    const result = [];
    class Foo {
      @before(() => result.push(2), () => result.push(3))
      bar() {
        result.push(1);
      }
    }
    const foo = new Foo();
    foo.bar();
    expect(result).toEqual([ 2, 3, 1 ]);
  });
});
