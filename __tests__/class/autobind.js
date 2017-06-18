import {autobindClass, applyDecorators} from 'index';
describe('autobindClass', () => {
  test('exclude must be an array', () => {
    expect(() => {
      @autobindClass({exclude: 1})
      class Foo {}
      return Foo;
    }).toThrow('options.exclude must be an array');
  });
  test('only can be used on class', () => {
    expect(() => class {
      @autobindClass()
      a () {}
    }).toThrow('@autobindClass can only be used on class');
  });
  test('prototype can be void', () => {
    function Foo () {}
    Foo.prototype = null;
    expect(() => applyDecorators(Foo, autobindClass())).toThrow('The prototype of the class is empty, please check it');
  });
  test('You can use @autobindClass on class', () => {
    @autobindClass()
    class Foo {
      a () {
        return this;
      }
      static b () {
        return this;
      }
    }

    const foo = new Foo();
    expect(foo.a()).toBe(foo);
    expect(Foo.b()).toBe(Foo);

    const {a} = foo;
    const {b} = Foo;
    expect(a()).toBe(foo);
    expect(b()).toBe();
  });
  test('@autobindClass support exclude', () => {
    @autobindClass({exclude: ['b']})
    class Foo {
      a () {
        return this;
      }
      b () {
        return this;
      }
    }

    const foo = new Foo();
    expect(foo.a()).toBe(foo);
    expect(foo.b()).toBe(foo);

    const {a, b} = foo;
    expect(a()).toBe(foo);
    expect(b()).toBe();
  });
});
