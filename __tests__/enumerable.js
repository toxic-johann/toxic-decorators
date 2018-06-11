import { enumerable, applyDecorators } from 'index';
const { getOwnPropertyDescriptor } = Object;
describe('enumerable', () => {
  test('facing undefined descriptor', () => {
    class Foo {}
    applyDecorators(Foo, {
      a: enumerable,
    });
    expect(Foo.prototype.a).toBe(undefined);
    expect(getOwnPropertyDescriptor(Foo.prototype, 'a').enumerable).toBe(true);
    const result = [];
    for (const key in Foo.prototype) result.push(key);
    expect(result).toEqual([ 'a' ]);
  });
  test('normal use', () => {
    class Foo {
      @enumerable
      a() {}
      b() {}
    }
    const foo = new Foo();
    expect(getOwnPropertyDescriptor(Foo.prototype, 'a').enumerable).toBe(true);
    expect(getOwnPropertyDescriptor(Foo.prototype, 'b').enumerable).toBe(false);
    const result = [];
    for (const key in foo) result.push(key);
    expect(result).toEqual([ 'a' ]);
  });
});
