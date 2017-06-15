import boolean from 'always/boolean';
describe('always/boolean', () => {
  class Foo {
    @boolean()
    bar = 1;
    _car = 1;
    @boolean()
    get car () {
      return this._car;
    }
    set car (value) {
      this._car = value;
      return this._car;
    }
  }
  test('@boolean can may property always be boolean', () => {
    const foo = new Foo();
    expect(typeof foo.bar).toBe('boolean');
    foo.bar = '123';
    expect(typeof foo.bar).toBe('boolean');
    foo.bar = 456;
    expect(typeof foo.bar).toBe('boolean');
  });
  test('@boolean can may getter/setter always be boolean', () => {
    const foo = new Foo();
    expect(typeof foo.car).toBe('boolean');
    expect(typeof foo._car).not.toBe('boolean');
    foo.car = true;
    expect(typeof foo.car).toBe('boolean');
    expect(typeof foo._car).toBe('boolean');
    foo.car = 456;
    expect(typeof foo.car).toBe('boolean');
    expect(typeof foo._car).toBe('boolean');
  });
});
