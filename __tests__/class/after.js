import { afterClass } from 'index';
describe('afterClass', () => {
  let fn;
  let result;
  let Foo;
  beforeEach(() => {
    fn = jest.fn();
    result = [];
    Foo = @afterClass({}, function() {
      fn();
      result.push('fn');
    })
      class Foo {
      a() {
        result.push('a');
      }
      b() {
        result.push('b');
      }
    };
  });
  test('normal run', () => {
    const foo = new Foo();
    foo.a();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toEqual([ 'a', 'fn' ]);
    foo.b();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toEqual([ 'a', 'fn', 'b', 'fn' ]);
  });
  test('self class run', () => {
    class Foo {
      c = 1;
      d = () => result.push('d');
    }
    const foo = new Foo();
    afterClass({ self: true }, function() {
      fn();
      result.push('fn');
    })(foo);
    foo.d();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toEqual([ 'd', 'fn' ]);
  });
});
