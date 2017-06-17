import * as utils from 'helper/utils';

describe('isObject', () => {
  const examples = [
    123, '123', true, {},
    {a: 123}, function (argument) {}, () => console.log('hello'), undefined,
    [], [1, 2, 3], null, new String(), // eslint-disable-line no-new-wrappers
    new Error(), new Boolean(), new Function(), new RegExp() // eslint-disable-line no-new-wrappers
  ];
  const results = [
    false, false, false, true,
    true, false, false, false,
    false, false, false, false,
    false, false, false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isObject(example)).toBe(results[index]);
    });
  });
});

describe('isArray', () => {
  const examples = [
    123, '123', true, { length: 10 },
    {a: 123}, function (argument) {}, () => console.log('hello'), undefined,
    [], [1, 2, 3], null, new Array() // eslint-disable-line
  ];
  const results = [
    false, false, false, false,
    false, false, false, false,
    true, true, false, true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isArray(example)).toBe(results[index]);
    });
  });
});

describe('makeArray', () => {
  const examples = [
    { length: 10 },
    document.querySelectorAll('body'),
    a => a,
    (function () { return arguments; })(1, 2, 3),
    'str', 1, true, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.makeArray(example).constructor).toBe(Array);
    });
  });
});

describe('isNumeric', () => {
  const examples = [
    1, 1.1, -1.2, '1.1',
    '.2', '-1.1', '1.2px', 'sth',
        {a: 123}, {}, function (argument) {}, () => console.log('hello'),
    undefined, [], [1, 2, 3], null
  ];
  const results = [
    true, true, true, true,
    true, true, false, false,
    false, false, false, false,
    false, false, false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isNumeric(example)).toBe(results[index]);
    });
  });
});

describe('isNumber', () => {
  const examples = [
    1, 1.1, -1.2, '1.1',
    '.2', '-1.1', '1.2px', 'sth',
        {a: 123}, {}, function (argument) {}, () => console.log('hello'),
    undefined, [], [1, 2, 3], null
  ];
  const results = [
    true, true, true, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isNumber(example)).toBe(results[index]);
    });
  });
});

describe('isInteger', () => {
  const examples = [
    1, 1.1, -1.2, '1.1',
    '0.2', '-1.1', '1.2px', 'sth',
        {a: 123}, {}, function (argument) {}, () => console.log('hello'),
    undefined, [], [1, 2, 3], null
  ];
  const results = [
    true, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isInteger(example)).toBe(results[index]);
    });
  });
});

describe('isBoolean', () => {
  const examples = [
    123, '123', true, {},
    {a: 123}, function (argument) {}, () => console.log('hello'), undefined,
    [], [1, 2, 3], null, new String(), // eslint-disable-line no-new-wrappers
    new Error(), new Boolean(), new Function(), new RegExp() // eslint-disable-line no-new-wrappers
  ];
  const results = [
    false, false, true, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isBoolean(example)).toBe(results[index]);
    });
  });
});

describe('isString', () => {
  const examples = [
    1, String('123'), '1' + '2', '1.1',
        {a: 123}, {}, function (argument) {}, () => console.log('hello'),
    undefined, [], [1, 2, 3], null,
    new String() // eslint-disable-line no-new-wrappers
  ];
  const results = [
    false, true, true, true,
    false, false, false, false,
    false, false, false, false,
    false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isString(example)).toBe(results[index]);
    });
  });
});

describe('isHTMLString', () => {
  const examples = [
    '1', '1 + 1', '<img/>', '<div></div>'
  ];
  const results = [
    false, false, true, true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isHTMLString(example)).toBe(results[index]);
    });
  });
});

describe('isUrl', () => {
  const examples = [
    'http://www.baidu.com', 'https://www.baidu.com', 'http://www.baidu.com:8360', 'http://www.baidu.com:8350/test/123/323',
    'http://www.baidu.com:8931/123?hel=er&idi=12', 'http://www.baidu.com:8931/123?hel=er&idi=12#23', 'http://www.baidu.com:8931/123?hel=er&idi=12#/123', 'http://www.baidu.com:8931/123?hel=er&idi=12#/1adv/dee1',
    'http://www.baidu.com:8931?abc=123&dd=123', 'http://www.baidu.com/#1232', 'http://127.0.0.1:8323/heif/dif?daf=123&eee=123#/wer', 'www.baidu.com',
    '127.0.0.1:8360/abc', 'http://xcq.baomtestu.com/?code=001FjtHZ0YjMdN1testlJZ0wMsHZ0FjtH6&state=STATE#!/list', 'http://www.baidu.com:8931/?abc=12<script>3&dd=123', 'http://abc.www.baidu.com:8222/ee/dd?aa=12ddae&iuiu=09okdke#!dfeef',
    'http://xcq.baomtestu.com/index/jump?url=http%3A%2F%2Fxcq.baomtestu.com%2F&code=031C1aCL0Vh5pj2vKDBL05jaCL0C1aCm&state=STATE', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd4e2cad1d27aac32&redirect_uri=http%3A%2F%2Fxcq.baomtestu.com%2Findex%2Fjump%3Furl%3Dhttp%253A%252F%252Fxcq.baomtestu.com%252F&response_type=code&scope=snsapi_userinfo&state=STATE&uin=ODU4MDgyMjYw&key=63e987ba88ddfb441e50ba091dbfae97ae0852366abdc163eec0312504facab191f3fb7c38eacd890e3c987670eb986b&pass_ticket=D54PVs4nx2uWmmdA8gzzbJjCW7hIFL0cYeQxXmBcLdM+wd9TzHeXLcNcCNaBNtm2Wor3NMmWog8JTIYMjFmsuA==', 'http://www.baidu.com:8931/?abc=123&dd=123', 'http://localhost:3000/',
    'https://www.google.com/search?newwindow=1&safe=strict&biw=2560&bih=1242&noj=1&q=url%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%89%E5%8D%8F%E8%AE%AE%E5%A4%B4%E5%90%97&oq=url%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%89%E5%8D%8F%E8%AE%AE%E5%A4%B4%E5%90%97&gs_l=serp.3...882275.887335.0.887549.32.17.1.0.0.0.618.2288.2-2j2j1j1.6.0....0...1c.1j4.64.serp..27.4.1135...0j0i10j30i10.XPT4WbWr2C4', 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=12306%E9%93%81%E8%B7%AF%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1%E4%B8%AD%E5%BF%83&rsv_pq=8d066b280000e58d&rsv_t=ab3a%2FcUYCHZi%2F0XM%2FQGYOs8ccohmv5Hv%2FvOICnoBN9E3LyUmuR7h0WQPads&rqlang=cn&rsv_enter=1&rsv_sug3=3&rsv_sug1=3&rsv_sug7=100&sug=12306%E9%93%81%E8%B7%AF%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1%E4%B8%AD%E5%BF%83&rsv_n=1'
  ];
  const results = [
    true, true, true, true,
    true, true, true, true,
    false, true, true, false,
    false, true, false, true,
    true, true, true, true,
    true, true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isUrl(example)).toBe(results[index]);
    });
  });
});

describe('isEmpty', () => {
  const examples = [
    0, 1, '', '12',
    {}, {a: 1}, [], [1, 2, 3],
    null, undefined, function (argument) {}, () => console.log('hello'),
    ' '
  ];
  const results = [
    true, false, true, false,
    true, false, true, false,
    true, true, false, false,
    false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isEmpty(example)).toBe(results[index]);
    });
  });
});

describe('isVoid', () => {
  const examples = [
    0, 1, '', '12',
    {}, {a: 1}, [], [1, 2, 3],
    null, undefined, function (argument) {}, () => console.log('hello'),
    ' '
  ];
  const results = [
    false, false, false, false,
    false, false, false, false,
    true, true, false, false,
    false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isVoid(example)).toBe(results[index]);
    });
  });
});

describe('isEvent', () => {
  const examples = [
    new Event('look', {'bubbles': true, 'cancelable': false}), {}, [], new String(), // eslint-disable-line no-new-wrappers
    new Function(), function () {}
  ];
  const results = [
    true, false, false, false,
    false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isEvent(example)).toBe(results[index]);
    });
  });
});

describe('isBlob', () => {
  const aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // an array consisting of a single DOMString
  const oMyBlob = new Blob(aFileParts, {type: 'text/html'}); // the blob
  const examples = [
    oMyBlob, {}, [], new String(), // eslint-disable-line no-new-wrappers
    new Function(), function () {}
  ];
  const results = [
    true, false, false, false,
    false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isBlob(example)).toBe(results[index]);
    });
  });
});

describe('isFile', () => {
  const aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // an array consisting of a single DOMString
  const oMyBlob = new Blob(aFileParts, {type: 'text/html'}); // the blob
  const examples = [
    oMyBlob, {}, [], new String(), // eslint-disable-line no-new-wrappers
    new Function(), function () {}
  ];
  const results = [
    false, false, false, false,
    false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isFile(example)).toBe(results[index]);
    });
  });
});

describe('isDate', () => {
  const examples = [
    new Date(), {}, [], new String(), // eslint-disable-line no-new-wrappers
    new Function(), function () {}, '2017-02-03', new Date('2017-02-03')
  ];
  const results = [
    true, false, false, false,
    false, false, false, true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isDate(example)).toBe(results[index]);
    });
  });
});

describe('isPrimitive', () => {
  const examples = [
    1, String('123'), '1' + '2', '1.1',
        {a: 123}, {}, function (argument) {}, () => console.log('hello'),
    undefined, [], [1, 2, 3], null,
    new String(), true, new Boolean(), new Date() // eslint-disable-line no-new-wrappers
  ];
  const results = [
    true, true, true, true,
    false, false, false, false,
    true, false, false, true,
    false, true, false, false
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isPrimitive(example)).toBe(results[index]);
    });
  });
});

describe('isFunction', () => {
  const examples = [
    /./, 1, '123', true,
    new Boolean(), new String(), new Date(), new Number(), // eslint-disable-line no-new-wrappers
    new Error(), new Boolean(), new Function(), new RegExp(), // eslint-disable-line no-new-wrappers
    () => {}, class {}, function () {}
  ];
  const results = [
    false, false, false, false,
    false, false, false, false,
    false, false, true, false,
    true, true, true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isFunction(example)).toBe(results[index]);
    });
  });
});

describe('isNode', () => {
  const examples = [
    undefined, null, true, 1,
    '1', {}, [], document.createElement('test')
  ];
  const results = [
    false, false, false, false,
    false, false, false, true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isNode(example)).toBe(results[index]);
    });
  });
});

describe('isElement', () => {
  const examples = [
    undefined, null, true, 1,
    '1', {}, [], document.createElement('test')
  ];
  const results = [
    false, false, false, false,
    false, false, false, true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isElement(example)).toBe(results[index]);
    });
  });
});

test('isChildNode', () => {
  const parent = document.createElement('div');
  const child = document.createElement('div');
  const orphan = document.createElement('div');
  parent.appendChild(child);
  expect(utils.isChildNode()).toBe(false);
  expect(utils.isChildNode(1, 2)).toBe(false);
  expect(utils.isChildNode(parent, 2)).toBe(false);
  expect(utils.isChildNode(3, parent)).toBe(false);
  expect(utils.isChildNode(child, parent)).toBe(false);
  expect(utils.isChildNode(parent, child)).toBe(true);
  expect(utils.isChildNode(parent, orphan)).toBe(false);
});

test('isPosterityNode', () => {
  const grandParent = document.createElement('div');
  const parent = document.createElement('div');
  const child = document.createElement('div');
  const orphan = document.createElement('div');
  grandParent.appendChild(parent);
  parent.appendChild(child);
  expect(utils.isPosterityNode()).toBe(false);
  expect(utils.isPosterityNode(1, 2)).toBe(false);
  expect(utils.isPosterityNode(parent, 2)).toBe(false);
  expect(utils.isPosterityNode(1, parent)).toBe(false);
  expect(utils.isPosterityNode(grandParent, parent)).toBe(true);
  expect(utils.isPosterityNode(grandParent, child)).toBe(true);
  expect(utils.isPosterityNode(child, grandParent)).toBe(false);
  expect(utils.isPosterityNode(parent, grandParent)).toBe(false);
  expect(utils.isPosterityNode(parent, orphan)).toBe(false);
  expect(utils.isPosterityNode(grandParent, orphan)).toBe(false);
  expect(utils.isPosterityNode(child, orphan)).toBe(false);
});

describe('deepClone', () => {
  expect(() => utils.deepClone()).toThrow('deepClone only accept non primitive type');
    // 不考虑循环引用
  const examples = [
    [1, 2, 3, {a: 1, b: {c: 2, d: [912, {a: 1}]}}],
    {a: 1},
    {a: 1, b: '2', c: {d: 3, e: [1, 3, 4], f: {g: 1, e: 2, p: [1, {a: 1, e: 2}, {a: 1, d: 2}]}}}
  ];
  const results = examples;
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      const answer = utils.deepClone(example);
      expect(answer).not.toBe(results[index]);
      expect(answer).toEqual(results[index]);
    });
  });
});

describe('deepAssign', () => {
  test('throw error', () => {
    expect(() => utils.deepAssign()).toThrow('deepAssign accept two and more argument');
    expect(() => utils.deepAssign(1)).toThrow('deepAssign accept two and more argument');
    expect(() => utils.deepAssign(1, 2)).toThrow('deepAssign only accept non primitive type');
  });
  const examples = [
    [[], []], [[0, 1, 2, 3, 4], [5, 6, 7, 8]], [[0, 1, 2], [4, 5, 6], [7, 8, 9]], [[], [0, 1, 2]],
    [[0, 1, 2], []], [[0, 1, 2], {}], [{}, [0, 1, 2]], [{'0': 0, '1': 1, '2': 2}, [7, 8, 9]],
    [[7, 8, 9], {'0': 0, '1': 1, '2': 2}],
    [{}, {}], [{}, {a: 1}], [{a: 1}, {b: 1}],
    [{a: 1}, {a: 2}], [{a: 1, b: 2}, {c: 3, d: 4}], [{a: 1, b: 2}, {b: 3, c: 4}], [{a: 1}, {b: {c: 1, d: 4}}],
    [{a: 1, b: {c: 1, d: 4, e: 5}}, {a: 1, b: {c: 21, d: 4}}]
  ];
  const results = [
    [], [5, 6, 7, 8, 4], [7, 8, 9], [0, 1, 2],
    [0, 1, 2], [0, 1, 2], {'0': 0, '1': 1, '2': 2}, {'0': 7, '1': 8, '2': 9},
    [0, 1, 2],
    {}, {a: 1}, {a: 1, b: 1},
    {a: 2}, {a: 1, b: 2, c: 3, d: 4}, {a: 1, b: 3, c: 4}, {a: 1, b: {c: 1, d: 4}},
    {a: 1, b: {c: 21, d: 4, e: 5}}
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      const origin = example[0];
      const result = utils.deepAssign(...example);
      expect(origin).toBe(result);
      expect(result).toEqual(results[index]);
    });
  });
});
describe('camelize', () => {
  const examples = [
    'helloWorld', 'hello world', 'hello-world', 'hello - world',
    'HelloWorld', '   Hello, world'
  ];
  examples.forEach((example, index) => {
    test('small ' + index.toString(), () => {
      expect(utils.camelize(example)).toBe('helloWorld');
    });
  });
  const examples2 = [
    'helloWorld', 'hello world', 'hello-world', 'hello - world',
    'HelloWorld', '   Hello, world'
  ];
  examples2.forEach((example, index) => {
    test('big ' + index.toString(), () => {
      expect(utils.camelize(example, true)).toBe('HelloWorld');
    });
  });
});

describe('hypenate', () => {
  const examples = ['helloWorld', '  hello  world', 'hello-world', 'HelloWorld'];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.hypenate(example)).toBe('hello-world');
    });
  });
});

describe('isPromise', () => {
  const examples = [
    1, 0, true, false,
    {}, [], new Promise(() => {}), Promise.resolve(),
    Promise.reject().catch(() => {})
  ];
  const results = [
    false, false, false, false,
    false, false, true, true,
    true
  ];
  examples.forEach((example, index) => {
    test(index.toString(), () => {
      expect(utils.isPromise(example)).toBe(results[index]);
    });
  });
});

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

describe('bind', () => {
  test('use bind', () => {
    const foo = {};
    function bar () {
      expect(this).toBe(foo);
    }
    utils.bind(bar, foo)();
  });
  test('use apply', () => {
    const foo = {};
    function bar () {
      expect(this).toBe(foo);
    }
    bar.bind = null;
    utils.bind(bar, foo)();
  });
  test('use call', () => {
    const foo = {};
    function bar () {
      expect(this).toBe(foo);
    }
    bar.bind = null;
    bar.apply = null;
    utils.bind(bar, foo)();
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
