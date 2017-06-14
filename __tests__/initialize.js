import initialize from 'initialize';
describe('initialize', () => {
  test('@initialize only accept function parameter', () => {
    expect(() => {
      return class {
        @initialize(1)
        foo () {}
      };
    }).toThrow('@initialize only accept function parameter');
  });
  test('@initialize is a function return decorators', () => {
    expect(() => class {
      @initialize
      foo () {}
    }).toThrow('You may use @initialize straightly, @initialize return decorators, you need to call it');
  });
  test('@initialize accept at least one parameter', () => {
    expect(() => class {
      @initialize()
      foo () {}
    }).toThrow("@initialize accept at least one parameter. If you don't need to initialize your value, do not add @initialize.");
  });
  test('@intialize can be used to intialize value', () => {
    class Foo {
      @initialize(function (value) {
        expect(value).toBe(1);
        return 2;
      })
      bar = 1;
    };
    const foo = new Foo();
    expect(foo.bar).toBe(2);
  });
  test('@initialize can be used to initialize function', () => {
    class Foo {
      @initialize(function () {
        return () => 'foo';
      })
      car () {
        return 'car';
      }
    }
    const foo = new Foo();
    expect(foo.car()).toBe('foo');
  });
  test('@initialize can get instance when it is used on property', () => {
    class Foo {
      @initialize(function () {
        return this;
      })
      bar = 1;
    };
    const foo = new Foo();
    expect(foo.bar).toBe(foo);
  });
  test('@initialize can be used on static property', () => {
    class Foo {
      @initialize(function () {
        expect(this.bar).toBe(1);
        return 2;
      })
      static bar = 1;
    };
    expect(Foo.bar).toBe(2);
  });
  test("@initialize can't handle accessor descriptor", () => {
    expect(() => class {
      @initialize(function () {})
      get one () {return 1;}
    }).toThrow('@initialize do not support accessor descriptor');
  });
});
