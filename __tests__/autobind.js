import { autobind, applyDecorators } from 'index';
describe('autobind', () => {
  let Foo;
  let Bar;
  let Car;
  let barCount;

  beforeEach(function() {
    Foo = class Foo {
      @autobind
      getFoo() {
        return this;
      }

      getFooAgain() {
        return this;
      }

      @autobind
      onlyOnFoo() {
        return this;
      }
    };

    barCount = 0;

    Bar = class Bar extends Foo {
      @autobind
      getFoo() {
        const foo = super.getFoo();
        barCount++;
        return foo;
      }

      getSuperMethod_getFoo() {
        return super.getFoo;
      }

      getSuperMethod_onlyOnFoo() {
        return super.onlyOnFoo;
      }

      @autobind
      onlyOnBar() {
        return this;
      }
    };

    Car = class Car extends Foo {
      @autobind
      getCarFromFoo() {
        return super.onlyOnFoo();
      }
    };
  });

  afterEach(function() {
    Foo = null;
    Bar = null;
    barCount = null;
  });
  test('returns a bound instance for a method', () => {
    const foo = new Foo();
    const { getFoo } = foo;
    expect(getFoo()).toBe(foo);
  });

  test('sets the correct instance descriptor options when bound', () => {
    const foo = new Foo();
    const { getFoo } = foo;
    const desc = Object.getOwnPropertyDescriptor(foo, 'getFoo');
    expect(desc.configurable).toBe(true);
    expect(desc.enumerable).toBe(false);
    expect(desc.writable).toBe(true);
    expect(desc.value).toBe(getFoo);
  });

  test('sets the correct instance descriptor options when reassigned outside', () => {
    const noop = function() {};
    const foo = new Foo();
    const ret = foo.getFoo = noop;
    const desc = Object.getOwnPropertyDescriptor(foo, 'getFoo');

    expect(ret).toBe(noop);
    expect(desc.configurable).toBe(true);
    expect(desc.enumerable).toBe(true);
    expect(desc.writable).toBe(true);
    expect(desc.value).toBe(noop);
  });

  test('works with multiple instances of the same class', () => {
    const foo1 = new Foo();
    const foo2 = new Foo();

    const getFoo1 = foo1.getFoo;
    const getFoo2 = foo2.getFoo;

    expect(getFoo1()).toBe(foo1);
    expect(getFoo2()).toBe(foo2);
  });

  test('returns the same bound function every time', () => {
    const foo = new Foo();
    const bar = new Bar();

    expect(foo.getFoo).toBe(foo.getFoo);
    expect(bar.getFoo).toBe(bar.getFoo);
    expect(bar.getSuperMethod_getFoo()).toBe(bar.getSuperMethod_getFoo());
    expect(bar.getFooAgain()).toBe(bar.getFooAgain());
  });

  test('works with inheritance, super.method() being autobound as well', () => {
    const bar = new Bar();
    const car = new Car();

    const getFooFromBar = bar.getFoo;
    const getCarFromFoo = car.getCarFromFoo;

    // Calling both forms more than once to catch
    // bugs that only appear after first invocation
    expect(getFooFromBar()).toBe(bar);
    expect(getFooFromBar()).toBe(bar);
    expect(getCarFromFoo()).toBe(car);
    expect(getCarFromFoo()).toBe(car);

    expect(bar.getFoo()).toBe(bar);
    expect(bar.getFoo()).toBe(bar);
    expect(bar.getFooAgain()).toBe(bar);
    const getSuperMethod_getFoo = bar.getSuperMethod_getFoo();

    expect(getSuperMethod_getFoo()).toBe(bar);
    const onlyOnFoo = bar.getSuperMethod_onlyOnFoo();
    expect(onlyOnFoo()).toBe(bar);
    expect(barCount).toBe(4);
  });

  test('throws when it needs WeakMap but it is not available', () => {
    const WeakMap = global.WeakMap;
    delete global.WeakMap;

    const bar = new Bar();

    expect(() => bar.getFoo()).toThrow('Using @autobind on getFoo() requires WeakMap support due to its use of super.getFoo()');
    expect(barCount).toBe(0);

    global.WeakMap = WeakMap;
  });

  test('does not override descriptor when accessed on the prototype', () => {
    Bar.prototype.getFoo;
    Bar.prototype.onlyOnBar;

    const bar = new Bar();
    const getFoo2 = bar.getFoo;
    const onlyOnBar = bar.onlyOnBar;
    expect(getFoo2()).toBe(bar);
    expect(onlyOnBar()).toBe(bar);

    expect(barCount).toBe(1);

    // check Foo after Bar since it was inherited by Bar and might accidentally
    // be bound to the instance of Foo above!
    Foo.prototype.getFoo;
    Foo.prototype.onlyOnFoo;

    const foo = new Foo();
    const getFoo1 = foo.getFoo;
    const onlyOnFoo = foo.onlyOnFoo;
    expect(getFoo1()).toBe(foo);
    expect(onlyOnFoo()).toBe(foo);
  });

  test('can only use on function', () => {
    expect(() => {
      return class {
        @autobind
        a = 2;
      };
    }).toThrow('@autobind can only be used on functions, not "undefined" in undefined on property "a"');
  });

  test('lookup on the prototype', () => {
    Object.getPrototypeOf(new Car()).getFoo();
  });

  test('throw error if descirptor is undefined', () => {
    class Foo {}
    expect(() => applyDecorators(Foo, {
      a: autobind,
    })).toThrow('@autobind can only be used on functions, not "undefined" in undefined on property "a"');
  });

  test('@autobind can alse be used on class, but you cannot pass it option', () => {
    @autobind
    class Foo {
      a() {
        return this;
      }
      static b() {
        return this;
      }
    }

    const foo = new Foo();
    expect(foo.a()).toBe(foo);
    expect(Foo.b()).toBe(Foo);

    const { a } = foo;
    const { b } = Foo;
    expect(a()).toBe(foo);
    expect(b()).toBe();
  });
});
