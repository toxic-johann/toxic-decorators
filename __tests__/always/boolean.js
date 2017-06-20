import {alwaysBoolean} from 'index';
describe('always/boolean', () => {
  class Foo {
    @alwaysBoolean(true)
    bar = 1;
    _car = 1;
    @alwaysBoolean()
    get car () {
      return this._car;
    }
    set car (value) {
      this._car = value;
      return this._car;
    }
  }
  test('@alwaysBoolean support custom vaule', () => {
    const foo = new Foo();
    expect(foo.bar).toBe(true);
  });
  test('@alwaysBoolean can may property always be boolean', () => {
    const foo = new Foo();
    expect(typeof foo.bar).toBe('boolean');
    foo.bar = '123';
    expect(typeof foo.bar).toBe('boolean');
    foo.bar = 456;
    expect(typeof foo.bar).toBe('boolean');
  });
  test('@alwaysBoolean can may getter/setter always be boolean', () => {
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
