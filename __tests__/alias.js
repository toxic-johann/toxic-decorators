import {alias, applyDecorators, frozen} from 'index';
describe('alias', () => {
  test('@alias need a string as key', () => {
    expect(() => class {
      @alias()
      foo () {}
    }).toThrow('@alias need a string as a key to find the porperty to set alias on');
  });
  test("@alias can't set alias on an existing attribute", () => {
    expect(() => class {
      @alias('bar')
      foo () {}
      bar () {}
    }).toThrow("@alias can't set alias on an existing attribute");
  });
  test('You must pass in a non-primitive value if you want to set alias on other instance', () => {
    expect(() => class {
      @alias(1, 'key')
      foo () {}
    }).toThrow('If you want to use @alias to set alias on other instance, you must pass in a legal instance');
  });
  test('if you really want to set alias on an existing attribute, pleast set option.force true', () => {
    class Foo {
      bar = 1;
      @alias('bar', {force: true})
      car = 2;
    };
    const foo = new Foo();
    expect(foo.bar).toBe(foo.car);
    expect(foo.bar).toBe(2);
  });
  test('if you really want to set alias on an existing frozen attribute. Well, we can acutually do nothing', () => {
    class Foo {
      @frozen
      bar = 1;
      @alias('bar', {force: true})
      car = 2;
    };
    expect(() => new Foo()).toThrow("You are tring to set alias on an existing attribute which its configurable is false. That's impossible. Please check if you have set @frozen on it.");
  });
  test('if you want to omit the error throw when you try to set alias on existing value, please set option.omit to be true', () => {
    class Foo {
      bar = 1;
      @alias('bar', {omit: true})
      car = 2;
    };
    const foo = new Foo();
    expect(foo.bar).toBe(1);
    expect(foo.car).toBe(2);
  });
  test('@alias can set alias for property', () => {
    class Foo {
      @alias('baz')
      bar = 1;
    };
    const foo = new Foo();
    expect(foo.bar).toBe(foo.baz);
    foo.baz = 2;
    expect(foo.bar).toBe(2);
    expect(foo.baz).toBe(foo.bar);
    foo.bar = 3;
    expect(foo.bar).toBe(3);
    expect(foo.baz).toBe(foo.bar);
  });
  test('@alias can set alias for static property', () => {
    class Foo {
      @alias('baz')
      static bar = 1;
    };
    expect(Foo.bar).toBe(Foo.baz);
    Foo.baz = 2;
    expect(Foo.bar).toBe(2);
    expect(Foo.baz).toBe(Foo.bar);
    Foo.bar = 3;
    expect(Foo.bar).toBe(3);
    expect(Foo.baz).toBe(Foo.bar);
  });
  test('@alias can set alias for function', () => {
    const fn = jest.fn();
    class Foo {
      @alias('baz')
      bar (...args) {
        fn(...args);
      }
    };
    const foo = new Foo();
    expect(foo.bar).toBe(foo.baz);
    foo.baz(2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2);
  });
  test('@alias can alse set alias for getter/setter', () => {
    class Foo {
      _bar = 1;
      @alias('baz')
      get bar () {
        return this._bar;
      }
      set bar (value) {
        this._bar = value;
        return this._bar;
      }
    }
    const foo = new Foo();
    expect(foo.baz).toBe();
    expect(foo.bar).toBe(foo.baz);
    expect(foo._bar).toBe(foo.baz);
    foo.baz = 2;
    expect(foo._bar).toBe(2);
    expect(foo.baz).toBe(foo.bar);
  });
  test('@alias can also let you to set alias on other object for property', () => {
    class Car {};
    const car = new Car();
    class Foo {
      @alias(car, 'baz')
      bar = 1;
    };
    const foo = new Foo();
    expect(foo.bar).toBe(car.baz);
    car.baz = 2;
    expect(foo.bar).toBe(2);
    expect(car.baz).toBe(foo.bar);
    foo.bar = 3;
    expect(foo.bar).toBe(3);
    expect(car.baz).toBe(foo.bar);
    expect(foo.baz).toBe();
  });
  test('@alias can also let you to set alias on other object for function', () => {
    class Car {};
    const car = new Car();
    const fn = jest.fn();
    class Foo {
      @alias(car, 'baz')
      bar (...args) {
        fn(...args);
      }
    };
    const foo = new Foo();
    expect(foo.bar).toBe(car.baz);
    car.baz(2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2);
    expect(foo.baz).toBe();
  });
  test('@alias can also let you to set alias on other class for function', () => {
    class Car {
    };
    const car = new Car();
    const fn = jest.fn();
    class Foo {
      @alias(Car.prototype, 'baz')
      bar (...args) {
        fn(...args);
      }
    };
    const foo = new Foo();
    expect(foo.bar).toBe(car.baz);
    car.baz(2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith(2);
    expect(foo.baz).toBe();
  });
  test('@alias can also let you to set alias on other object for getter/setter', () => {
    class Car {};
    const car = new Car();
    class Foo {
      _bar = 1;
      @alias(car, 'baz')
      get bar () {
        return this._bar;
      }
      set bar (value) {
        this._bar = value;
        return this._bar;
      }
    }
    const foo = new Foo();
    expect(car.baz).toBe();
    expect(foo.bar).toBe(car.baz);
    expect(foo._bar).toBe(car.baz);
    car.baz = 2;
    expect(foo._bar).toBe(2);
    expect(car.baz).toBe(foo.bar);
    expect(foo.baz).toBe();
  });
  test('@alias works well with undefined', () => {
    class Foo {}
    const foo = new Foo();
    applyDecorators(foo, {
      a: alias('b')
    }, {self: true});
    expect(foo.a).toBe(Foo.b);
    expect(foo.a).toBe();
    foo.a = 1;
    expect(foo.a).toBe(foo.b);
    expect(foo.a).toBe(1);
  });
  test('@alias can handle deep property', () => {
    class Bar {
      deepFlag = {
        you: {
          can: {
          }
        }
      };
      @alias('deepFlag.you.can.run')
      run = 1;
    }
    const bar = new Bar();
    expect(bar.run).toBe(1);
    expect(bar.deepFlag.you.can.run).toBe(1);
    bar.deepFlag.you.can.run = 2;
    expect(bar.run).toBe(2);
    expect(bar.deepFlag.you.can.run).toBe(2);
    bar.run = 3;
    expect(bar.run).toBe(3);
    expect(bar.deepFlag.you.can.run).toBe(3);
  });
  test('@alias can do nothing if deepproperty is not exist', () => {
    class Bar {
      deepFlag = {
        can: {
          }
      };
      @alias('deepFlag.you.can.run')
      run = 1;
    }
    expect(() => new Bar()).toThrow('obj.deepFlag.you is undefined');
  });
  test('@alias require you to pass in legal instance even you are using deepproperty.', () => {
    class Bar {
      deepFlag = {
        you: {
          can: 1
        }
      };
      @alias('deepFlag.you.can.run')
      run = 1;
    }
    expect(() => new Bar()).toThrow('If you want to use @alias to set alias on other instance, you must pass in a legal instance');
  });
});
