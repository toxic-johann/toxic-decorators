import {nonextendable, applyDecorators} from 'index';
describe('@nonextendable', () => {
  test('object is not extendable', () => {
    class Foo {
      @nonextendable
      a = {
        b: 1
      };
    }
    const foo = new Foo();
    expect(() => {foo.a.c = 2;}).toThrow();
    foo.a.b = 2;
    expect(foo.a.b).toBe(2);
  });
  test('array is not extendable', () => {
     class Foo {
      @nonextendable
      a = [1];
    }
    const foo = new Foo();
    expect(() => {foo.a[1] = 2;}).toThrow();
    foo.a[0] = 2;
    expect(foo.a[0]).toBe(2);
  });
  test('cannot be used on undefined', () => {
    class Foo {};
    expect(() => applyDecorators(Foo, {a: nonextendable})).toThrow();
  });
});
