import { waituntilClass } from 'index';
describe('waituntilClass', () => {
  let fn;
  let Foo;
  let flag;
  beforeEach(() => {
    flag = false;
    fn = jest.fn();
    Foo = @waituntilClass({}, function() {
      return flag;
    })
      class Foo {
      a() {
        fn();
      }
      b() {
        fn();
      }
    };
  });
  test('normal run', () => {
    const foo = new Foo();
    foo.a();
    expect(fn).toHaveBeenCalledTimes(0);
    foo.b();
    expect(fn).toHaveBeenCalledTimes(0);
    flag = true;
    foo.a();
    expect(fn).toHaveBeenCalledTimes(1);
    foo.b();
    expect(fn).toHaveBeenCalledTimes(2);
  });
  test('self class run', () => {
    class Foo {
      c = 1;
      d = () => fn();
    }
    const foo = new Foo();
    waituntilClass({ self: true }, function() {
      return flag;
    })(foo);
    foo.d();
    expect(fn).toHaveBeenCalledTimes(0);
    flag = true;
    foo.d();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
