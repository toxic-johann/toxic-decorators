import * as utils from 'helper/utils';

test('transObjectAttrIntoArray', () => {
  expect(utils.transObjectAttrIntoArray({})).toEqual([]);
  expect(utils.transObjectAttrIntoArray({1: 'a', 2: 'b'})).toEqual(['a', 'b']);
  expect(utils.transObjectAttrIntoArray({1: 'a', 2: 'b'}, (b, a) => +a - +b)).toEqual(['b', 'a']);
});

describe('compressOneArgFnArray', () => {
  test('must pass an array', () => {
    expect(() => utils.compressOneArgFnArray()).toThrow();
  });
  test("array can't be empty", () => {
    expect(() => utils.compressOneArgFnArray([])).toThrow();
  });
  test('array can only contain function', () => {
    expect(() => utils.compressOneArgFnArray([function () {}, 1])).toThrow();
    expect(() => utils.compressOneArgFnArray([1])).toThrow();
  });
});

describe('isDescriptor', () => {
  test('empty object', () => {
    expect(utils.isDescriptor({})).toBe(false);
  });
});

describe('isAccessorDescriptor', () => {
  test('with getter/setter', () => {
    expect(utils.isAccessorDescriptor({
      get () {},
      set () {},
      configurable: true,
      enumerable: true
    })).toBe(true);
  });
  test('with only setter', () => {
    expect(utils.isAccessorDescriptor({
      set () {},
      configurable: true,
      enumerable: true
    })).toBe(true);
  });
  test('without getter/setter', () => {
    expect(utils.isAccessorDescriptor({
      configurable: true,
      enumerable: true
    })).toBe(false);
  });
});

describe('isDataDescriptor', () => {
  test('object without value', () => {
    expect(utils.isDataDescriptor({})).toBe(false);
  });
  test('object with value', () => {
    expect(utils.isDataDescriptor({value: 1})).toBe(false);
  });
});

describe('warn', () => {
  test('normal mode', () => {
    const originConsole = console;
    global.console = {warn: jest.fn()};
    utils.warn('123');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).lastCalledWith('123');
    global.console = originConsole;
  });
  test('log mode', () => {
    const originConsole = console;
    global.console = {log: jest.fn()};
    utils.warn('123');
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).lastCalledWith('123');
    global.console = originConsole;
  });
});

test('getOwnPropertyDescriptors', () => {
  const originFn = global.Object.getOwnPropertyDescriptors;
  global.Object.getOwnPropertyDescriptors = false;
  class Foo {
    a = 1;
    static b = 2;
    c () {}
    static d () {}
    e = '123';
    static f = '123';
  }
  const foo = new Foo();
  expect(originFn(foo)).toEqual(utils.getOwnPropertyDescriptorsFn()(foo));
});

describe('compressMultipleDecorators', () => {
  test("array can't be empty", () => {
    expect(() => utils.compressMultipleDecorators()).toThrow();
  });
  test('array can only contain function', () => {
    expect(() => utils.compressMultipleDecorators(function () {}, function () {}, 2)()).toThrow('Decorators must be a function, but not "2" in number');
    expect(() => utils.compressMultipleDecorators(1)).toThrow('Decorators must be a function, but not "1" in number');
  });
});

describe('getOwnKeys', () => {
  test('no getOwnPropertySymbols', () => {
    class Foo {
      a = 1;
      static b = 2;
      c () {}
      static d () {}
      e = '123';
      static f = '123';
    }
    const foo = new Foo();
    const {getOwnPropertyNames, getOwnPropertySymbols} = Object;
    global.Object.getOwnPropertySymbols = false;
    expect(utils.getOwnKeysFn()(foo)).toEqual(getOwnPropertyNames(foo));
    global.Object.getOwnPropertySymbols = getOwnPropertySymbols;
  });
});
