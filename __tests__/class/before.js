import {beforeClass} from 'index';
describe('beforeClass', () => {
  let fn;
  let result;
  let Foo;
  beforeEach(() => {
    fn = jest.fn();
    result = [];
    Foo = @beforeClass({}, function () {
      fn();
      result.push('fn');
    })
    class Foo {
      a () {
        result.push('a');
      }
      b () {
        result.push('b');
      }
    };
  });
  test('normal run', () => {
    const foo = new Foo();
    foo.a();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['fn', 'a']);
    foo.b();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toEqual(['fn', 'a', 'fn', 'b']);
  });
  test('self class run', () => {
    class Foo {
      c = 1;
      d = () => result.push('d');
    };
    const foo = new Foo();
    beforeClass({self: true}, function () {
      fn();
      result.push('fn');
    })(foo);
    foo.d();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['fn', 'd']);
  });
});
