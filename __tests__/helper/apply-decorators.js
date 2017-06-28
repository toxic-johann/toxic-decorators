import {applyDecorators, initialize, frozen, before, autobindClass} from 'index';
describe('applyDecorators', () => {
  test('when Class is not a class, throw error', () => {
    expect(() => applyDecorators()).toThrow('applyDecorators only accept class as first arguments');
  });
  test('when props is not an obj, throw error', () => {
    expect(() => applyDecorators(function () {})).toThrow('applyDecorators only accept object as second arguments');
  });
  test('a class must contain prototype', () => {
    const fn = function () {};
    fn.prototype = null;
    expect(() => applyDecorators(fn, {})).toThrow('The class muse have a prototype, please take a check');
  });
  test('props must accept array of function', () => {
    const originConsole = global.console;
    global.console = Object.assign({}, originConsole, {
      warn: jest.fn()
    });
    expect(() => applyDecorators(function () {}, {a: ['what']})).toThrow('The decorators set on props must be Function or Array of Function');
    expect(console.warn).toHaveBeenCalledTimes(1);
    global.console = originConsole;
  });
  test('empty props is ok', () => {
    expect(() => applyDecorators(function () {}, {})).not.toThrow();
  });
  test('{[string]: function} as props is ok, methods decorators', () => {
    const fn = jest.fn();
    class Foo {
      run () {
        fn();
      }
    }
    applyDecorators(Foo, {
      run: before(fn)
    });
    const foo = new Foo();
    foo.run();
    expect(fn).toHaveBeenCalledTimes(2);
  });
  test('{[string]: Array<Function>} is also good, methods decorators', () => {
    const fn = jest.fn();
    class Foo {
      run () {
        fn();
      }
    }
    applyDecorators(Foo, {
      run: [before(fn), before(fn)]
    });
    const foo = new Foo();
    foo.run();
    expect(fn).toHaveBeenCalledTimes(3);
  });
  test('{[string]: function} as props is ok, property decorators on prototype, maybe looks strange for user.', () => {
    class Foo {
      b = 2;
    };
    expect(applyDecorators(Foo, {
      a: initialize(function () {return 2;}),
      b: initialize(function () {return 3;})
    })).toBe(Foo);
    const foo = new Foo();
    expect(Foo.prototype.a).toBe(2);
    expect(foo.a).toBe(2);
    expect(Foo.prototype.b).toBe(3);
    expect(foo.b).toBe(2);
  });
  test('{[string]: Array<Function>} is also good, property decorators on prototype, maybe looks strange for user.', () => {
    class Foo {
    }
    expect(applyDecorators(Foo, {
      a: [initialize(function () {return 2;}), frozen]
    })).toBe(Foo);
    const foo = new Foo();
    expect(foo.a).toBe(2);
    expect(() => {foo.a = 3;}).toThrow();
    expect(() => {delete foo.a;}).not.toThrow();
    expect(() => {delete Foo.prototype.a;}).toThrow();
  });
  test('support self mode, so that you can handle instance directly', () => {
    class Foo {
      a = 1;
      b = 2;
    };
    const foo = new Foo();
    expect(foo.a).toBe(1);
    expect(foo.b).toBe(2);
    expect(applyDecorators(foo, {
      a: initialize(function () {return 2;}),
      b: initialize(function () {return 3;})
    }, {self: true})).toBe(foo);
    expect(Foo.prototype.a).toBe();
    expect(foo.a).toBe(2);
    expect(Foo.prototype.b).toBe();
    expect(foo.b).toBe(3);
  });
  test("even in self mode, we can't not handle primitive value", () => {
    expect(() => applyDecorators(1, {}, {self: true})).toThrow("We can't apply docorators on a primitive value, even in self mode");
  });
   test('applyDecorators can be used on class, but you have to passed a legal class', () => {
     expect(() => applyDecorators(1, function () {})).toThrow('If you want to decorator class, you must pass it a legal class');
   });
   test('applyDecorators can used on class with decorator', () => {
     expect(() => applyDecorators(function () {}, autobindClass())).not.toThrow();
   });
   test('appyDecorators can used on class with multiple decorators', () => {
     expect(() => applyDecorators(function () {}, [autobindClass()])).not.toThrow();
   });
   test('appyDecorators can used on class with multiple decorators, but you must pass array of function', () => {
     expect(() => applyDecorators(function () {}, [1])).toThrow('If you want to decorate an class, you must pass it function or array of function');
   });
});
