import {alias, applyDecorators} from 'index';
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
      @alias('baz', car)
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
      @alias('baz', car)
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
      @alias('baz', Car.prototype)
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
      @alias('baz', car)
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
});
