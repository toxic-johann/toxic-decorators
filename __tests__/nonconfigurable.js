import {nonconfigurable, applyDecorators} from 'index';
const {getOwnPropertyDescriptor} = Object;
describe('nonconfigurable', () => {
  test('facing undefined descriptor', () => {
    class Foo {};
    applyDecorators(Foo, {
      a: nonconfigurable
    });
    expect(Foo.prototype.a).toBe(undefined);
    expect(getOwnPropertyDescriptor(Foo.prototype, 'a').configurable).toBe(false);
    expect(() => {delete Foo.prototype.a;}).toThrow();
  });
  test('normal use', () => {
    class Foo {
      @nonconfigurable
      b = 1;
      a = 1;
    }
    const foo = new Foo();
    expect(getOwnPropertyDescriptor(foo, 'a').configurable).toBe(true);
    expect(getOwnPropertyDescriptor(foo, 'b').configurable).toBe(false);
    expect(() => {delete foo.b;}).toThrow();
    expect(() => {delete foo.a;}).not.toThrow();
  });
});
