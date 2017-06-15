import number from 'always/number';
describe('always/number', () => {
  class Foo {
    @number()
    bar = '1';
    _car = '1';
    @number()
    get car () {
      return this._car;
    }
    set car (value) {
      this._car = value;
      return this._car;
    }
  }
  test('@number can may property always be number', () => {
    const foo = new Foo();
    expect(typeof foo.bar).toBe('number');
    foo.bar = '123';
    expect(typeof foo.bar).toBe('number');
    foo.bar = 456;
    expect(typeof foo.bar).toBe('number');
  });
  test('@number can may getter/setter always be number', () => {
    const foo = new Foo();
    expect(typeof foo.car).toBe('number');
    expect(typeof foo._car).not.toBe('number');
    foo.car = '123';
    expect(typeof foo.car).toBe('number');
    expect(typeof foo._car).toBe('number');
    foo.car = 456;
    expect(typeof foo.car).toBe('number');
    expect(typeof foo._car).toBe('number');
  });
});
