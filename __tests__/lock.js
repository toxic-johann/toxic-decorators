import { lock, applyDecorators } from 'index';
describe('@lock', () => {
  class Foo {
    @lock
    first() {}

    @lock
    second = 'second';

    third() {}

    forth = 'forth';
  }
  class Bar {
    _flag = true;
    @lock
    get flag() {
      return this._flag;
    }
    set flag(value) {
      this._flag = value;
      return this._flag;
    }
  }
  test('@lock marks descriptor as writable === false', () => {
    expect(Object.getOwnPropertyDescriptor(Foo.prototype, 'first').writable).toBe(false);
  });
  test('@lock marks descriptor as enumerable what it should be', () => {
    expect(Object.getOwnPropertyDescriptor(Foo.prototype, 'first').enumerable).toBe(false);
    const foo = new Foo();
    expect(Object.getOwnPropertyDescriptor(foo, 'second').enumerable).toBe(true);
  });
  test('@lock marks descriptor as configurable === false', () => {
    expect(Object.getOwnPropertyDescriptor(Foo.prototype, 'first').configurable).toBe(false);
  });
  test('@lock makes setting property error', () => {
    const foo = new Foo();
    expect(() => { foo.first = 'I will error'; }).toThrow("Cannot assign to read only property 'first' of object '#<Foo>'");
    expect(() => { foo.second = 'I will also error'; }).toThrow("Cannot assign to read only property 'second' of object '#<Foo>'");
  });
  test('@lock makes setting setter error', () => {
    const bar = new Bar();
    expect(() => { bar.flag = 'I still be an error'; }).toThrow('Cannot set property flag of #<Bar> which has only a getter');
    expect(bar.flag).toBe(true);
    expect(() => { bar.flag = 'I still be an error'; }).toThrow("Cannot assign to read only property 'flag' of object '#<Bar>'");
  });
  test('If you used @lock on getter/setter, once you have used getter/setter, your value will be lock', () => {
    const bar = new Bar();
    expect(bar.flag).toBe(true);
    bar._flag = false;
    expect(bar.flag).toBe(true);
  });
  test('makes delete error', () => {
    const foo = new Foo();
    delete foo.first;
    expect(foo.first).not.toBe();
    expect(() => { delete foo.second; }).toThrow("Cannot delete property 'second' of #<Foo>");
  });
  test('make it not enumerable', () => {
    const foo = new Foo();
    const keys = [];
    for (const key in foo) {
      keys.push(key);
    }
    expect(keys).toEqual([ 'second', 'forth' ]);
  });
  test('@lock can handle situation when getter is undefined, and it will throw a waring.', () => {
    const originConsole = console;
    global.console = Object.assign({}, originConsole, { warn: jest.fn() });
    let value = 1;
    class Car {
      @lock
      set one(val) {
        value = val;
        return value;
      }
    }
    const car = new Car();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).lastCalledWith('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
    expect(Object.getOwnPropertyDescriptor(car, 'one')).toBe();
    expect(car.one).toBe();
    expect(() => { car.one = 2; }).toThrow('Cannot set property one of #<Car> which has only a getter');
    global.console = originConsole;
  });
  test('@lock can lock undefined,(It may be sound useless..', () => {
    const originConsole = console;
    global.console = Object.assign({}, originConsole, { warn: jest.fn() });
    class Foo {}
    applyDecorators(Foo, {
      a: lock,
    });
    expect(console.warn).lastCalledWith('You are using @lock on an undefined property "a". This property will become a lock undefined forever, which is meaningless.');
    expect(Foo.prototype.a).toBe();
    expect(() => { Foo.prototype.a = 3; }).toThrow();
    expect(() => { delete Foo.prototype.a; }).toThrow();
    global.console = originConsole;
  });
});
