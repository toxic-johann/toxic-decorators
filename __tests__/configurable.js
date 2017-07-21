import {configurable, applyDecorators} from 'index';
const {getOwnPropertyDescriptor} = Object;
describe('configurable', () => {
  test('facing undefined descriptor', () => {
    class Foo {};
    applyDecorators(Foo, {
      a: configurable
    });
    expect(Foo.prototype.a).toBe(undefined);
    expect(getOwnPropertyDescriptor(Foo.prototype, 'a').configurable).toBe(true);
    expect(() => {delete Foo.prototype.a;}).not.toThrow();
  });
  test('normal use', () => {
    class Foo {
      @configurable
      b = 1;
      a = 1;
    }
    const foo = new Foo();
    expect(getOwnPropertyDescriptor(foo, 'a').configurable).toBe(true);
    expect(getOwnPropertyDescriptor(foo, 'b').configurable).toBe(true);
    expect(() => {delete foo.b;}).not.toThrow();
    expect(() => {delete foo.a;}).not.toThrow();
  });
});
