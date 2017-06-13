import readonly from 'readonly';
describe('@readonly', () => {
  class Foo {
    @readonly
    first () {}

    @readonly
    second = 'second';
  }
  test('marks descriptor as writable === false', () => {
    expect(Object.getOwnPropertyDescriptor(Foo.prototype, 'first').writable).toBe(false);
  });
  test('makes setting property error', () => {
    const foo = new Foo();
    expect(() => {foo.first = 'I will error';}).toThrow("Cannot assign to read only property 'first' of object '#<Foo>'");
    expect(() => {foo.second = 'I will also error';}).toThrow("Cannot assign to read only property 'second' of object '#<Foo>'");
  });
});
