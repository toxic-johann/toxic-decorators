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

describe('getDeepProperty', () =>{
 const obj = {
   a: {
     b: {
       c: 1
     }
   }
 };
 test('key is not an array', () => {
   expect(() => utils.getDeepProperty()).toThrow('keys of getDeepProperty must be string or Array<string>');
 });
 test('obj is empty and throw Error', () => {
   expect(() => utils.getDeepProperty(null, 'hello', {throwError: true})).toThrow('obj itself is null');
 });
 test('obj is empty but do not throw error', () => {
   expect(utils.getDeepProperty(undefined, 'nothing')).toBe();
 });
 test('obj is not empty but property do not exist, and i want it to throw error', () => {
   expect(() => utils.getDeepProperty(obj, 'a.c.d', {throwError: true})).toThrow('obj.a.c is undefined');
 });
 test('key can be an array', () => {
   expect(utils.getDeepProperty(obj, ['a', 'b', 'c'])).toBe(1);
 });
 test('key can be string', () => {
   expect(utils.getDeepProperty(obj, 'a.b.c')).toBe(1);
 });
});
