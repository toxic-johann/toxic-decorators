import {nonenumerable, applyDecorators} from 'index';
const {getOwnPropertyDescriptor} = Object;
describe('nonenumerable', () => {
  test('facing undefined descriptor', () => {
    class Foo {};
    applyDecorators(Foo, {
      a: nonenumerable
    });
    expect(Foo.prototype.a).toBe(undefined);
    expect(getOwnPropertyDescriptor(Foo.prototype, 'a').enumerable).toBe(false);
    const result = [];
    for(const key in Foo.prototype) result.push(key);
    expect(result).toEqual([]);
  });
  test('normal use', () => {
    class Foo {
      @nonenumerable
      b = 1;
      a = 1;
    }
    const foo = new Foo();
    expect(getOwnPropertyDescriptor(foo, 'a').enumerable).toBe(true);
    expect(getOwnPropertyDescriptor(foo, 'b').enumerable).toBe(false);
    const result = [];
    for(const key in foo) result.push(key);
    expect(result).toEqual(['a']);
  });
});
