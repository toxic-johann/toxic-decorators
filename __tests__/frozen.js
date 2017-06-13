import frozen from 'frozen';
describe('@frozen', () => {
  class Foo {
    @frozen
    first () {}

    @frozen
    second = 'second';

    third () {}

    forth = 'forth';
  }
  test('marks descriptor as writable === false', () => {
    expect(Object.getOwnPropertyDescriptor(Foo.prototype, 'first').writable).toBe(false);
  });
  test('marks descriptor as enumerable === false', () => {
    expect(Object.getOwnPropertyDescriptor(Foo.prototype, 'first').enumerable).toBe(false);
  });
  test('marks descriptor as configurable === false', () => {
    expect(Object.getOwnPropertyDescriptor(Foo.prototype, 'first').configurable).toBe(false);
  });
  test('makes setting property error', () => {
    const foo = new Foo();
    expect(() => {foo.first = 'I will error';}).toThrow("Cannot assign to read only property 'first' of object '#<Foo>'");
    expect(() => {foo.second = 'I will also error';}).toThrow("Cannot assign to read only property 'second' of object '#<Foo>'");
  });
  test('makes delete useless', () => {
    const foo = new Foo();
    delete foo.first;
    expect(foo.first).not.toBe();
    expect(() => {delete foo.second;}).toThrow("Cannot delete property 'second' of #<Foo>");
  });
  test('make it not enumerable', () => {
    const foo = new Foo();
    const keys = [];
    for(const key in foo) {
      keys.push(key);
    }
    expect(keys).toEqual(['forth']);
  });
});
