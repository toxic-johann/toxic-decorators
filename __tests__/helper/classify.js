import { classify } from 'index';
describe('classify', () => {
  let fn;
  let Foo;
  let props;
  let decorator;
  beforeEach(() => {
    props = [];
    fn = jest.fn();
    decorator = function(obj, prop, desc) {
      fn();
      props.push(prop);
      if (!desc) {
        return {
          value: fn,
          writable: true,
          configurable: true,
          enumerable: false,
        };
      }
      return desc;
    };
    Foo = class Foo {
      a() {}
      b() {}
      static c() {}
      static d() {}
      e = 1;
      static f = 1;
    };
  });
  test('classsify a decorator to handle all the method', () => {
    classify(decorator)()(Foo);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(props).toEqual([ 'a', 'b' ]);
  });
  test('classify a decorator to handle static property', () => {
    classify(decorator)({ self: true })(Foo);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(props).toEqual([ 'c', 'd', 'f' ]);
  });
  test('classify a decorator on an instance by self', () => {
    const foo = new Foo();
    classify(decorator)({ self: true })(foo);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(props).toEqual([ 'e' ]);
  });
  test("classify a decorator on the instance's __proto__ by self", () => {
    const foo = new Foo();
    /* eslint-disable no-proto */
    classify(decorator)({ self: true })(foo.__proto__);
    /* eslint-enable no-proto */
    expect(fn).toHaveBeenCalledTimes(2);
    expect(props).toEqual([ 'a', 'b' ]);
  });
  test('classify on the prototype including contructor', () => {
    classify(decorator)({ construct: true })(Foo);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(props).toEqual([ 'constructor', 'a', 'b' ]);
  });
  test('exclude sth', () => {
    classify(decorator)({ exclude: [ 'a' ] })(Foo);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(props).toEqual([ 'b' ]);
  });
  test('include sth', () => {
    classify(decorator)({ include: [ 'g' ] })(Foo);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(props).toEqual([ 'a', 'b', 'g' ]);
    const foo = new Foo();
    expect(foo.g).toBe(fn);
  });
  test('requirement', () => {
    classify(decorator, { requirement() { return false; } })()(Foo);
    expect(fn).toHaveBeenCalledTimes(0);
    expect(props).toEqual([]);
  });
  test('custom args', () => {
    fn = jest.fn();
    decorator = function(...args) {
      fn(...args);
      return function(obj, prop, desc) {
        if (!desc) {
          return {
            value: fn,
            writable: true,
            configurable: true,
            enumerable: false,
          };
        }
        return desc;
      };
    };
    Foo = class Foo {
      a() {}
    };
    classify(decorator, { customArgs: true })({}, 'a', 'b', 'c')(Foo);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith('a', 'b', 'c');
  });
  test('exclude must be an array', () => {
    expect(() => classify(decorator)({ exclude: 1 })(Foo)).toThrow('options.exclude must be an array');
  });
  test('include must be an array', () => {
    expect(() => classify(decorator)({ include: 1 })(Foo)).toThrow('options.include must be an array');
  });
  test('can only be used on class', () => {
    expect(() => classify(decorator)()({})).toThrow('@decoratorClass can only be used on class');
  });
  test('can only use in non-primitive type when you are using self mode', () => {
    expect(() => classify(decorator)({ self: true })(1)).toThrow("@decoratorClass must be used on non-primitive type value in 'self' mode");
  });
  test('no prototype', () => {
    const fn = function() {};
    fn.prototype = null;
    expect(() => classify(decorator)()(fn)).toThrow('The prototype of the fn is empty, please check it');
  });
});
