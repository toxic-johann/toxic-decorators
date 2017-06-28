import {watch} from 'index';
describe('watch', () => {
  // test('key or function as first parameter', () => {
  //   expect(() => class {
  //     @watch()
  //     a = 1;
  //   }).toThrow('You must pass a function or a string to find the hanlder function.');
  // });
  // test('other must be an legal instance', () => {
  //   expect(() => class {
  //     @watch('123', {other: 123})
  //     a = 1;
  //   }).toThrow('If you want us to trigger function on the other instance, you must pass in a legal instance');
  // });
  // test('You can pass in the function on some instance by string, but please make sure the function exist', () => {
  //   class Foo {
  //     @watch('b')
  //     a = 1
  //   }
  //   const foo = new Foo();
  //   expect(() => {foo.a = 3;}).toThrow('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
  // });
  // test('you can omit the illegal other instance error', () => {
  //   class Foo {
  //     @watch('b', {omit: true})
  //     a = 1
  //   }
  //   const foo = new Foo();
  //   expect(() => {foo.a = 3;}).not.toThrow();
  // });
  // test('we can watch a single property', () => {
  //   const fn = jest.fn();
  //   class Foo {
  //     @watch(function (...args) {
  //       expect(this).toBe(foo);
  //       fn(...args);
  //     })
  //     a = 1;
  //   }
  //   const foo = new Foo();
  //   expect(foo.a).toBe(1);
  //   foo.a = 2;
  //   expect(fn).toHaveBeenCalledTimes(1);
  //   expect(fn).lastCalledWith(2, 1);
  //   expect(foo.a).toBe(2);
  //   foo.a = 3;
  //   expect(fn).toHaveBeenCalledTimes(2);
  //   expect(fn).lastCalledWith(3, 2);
  //   expect(foo.a).toBe(3);
  // });
  test('we can watch a single property on the function indicate by string', () => {
    const fn = jest.fn();
    class Foo {
      @watch('b')
      a = 1;
      b (...args) {
        console.log('b')
        expect(this).toBe(foo);
        fn(...args);
      }
    }
    const foo = new Foo();
    expect(foo.a).toBe(1);
    foo.a = 2;
    // expect(fn).toHaveBeenCalledTimes(1);
    // expect(fn).lastCalledWith(2, 1);
    expect(foo.a).toBe(2);
    foo.a = 3;
    // expect(fn).toHaveBeenCalledTimes(2);
    // expect(fn).lastCalledWith(3, 2);
    expect(foo.a).toBe(3);
  });
  // test('we can watch on a getter/setter', () => {
  //   let value = 1;
  //   const fn = jest.fn();
  //   class Foo {
  //     @watch(function (...args) {
  //       expect(this).toBe(foo);
  //       fn(...args);
  //     })
  //     get a () {return value;}
  //     set a (val) {value = val;}
  //   }
  //   const foo = new Foo();
  //   expect(foo.a).toBe(1);
  //   foo.a = 2;
  //   expect(fn).toHaveBeenCalledTimes(1);
  //   expect(fn).lastCalledWith(2, 1);
  //   expect(foo.a).toBe(2);
  //   foo.a = 3;
  //   expect(fn).toHaveBeenCalledTimes(2);
  //   expect(fn).lastCalledWith(3, 2);
  //   expect(foo.a).toBe(3);
  // });
  // describe('we can watch on a object deeply', () => {
  //   let fn;
  //   let foo;
  //   beforeEach(() => {
  //     fn = jest.fn();
  //     class Foo {
  //       @watch(fn, {deep: true})
  //       bar = {
  //         a: 1,
  //         b: {
  //           c: 2
  //         },
  //         d: {
  //           e: {
  //             f: 3
  //           }
  //         }
  //       }
  //     };
  //     foo = new Foo();
  //   });
  //   test('we can watch the object before you reset it', () => {
  //     foo.bar.a = 2;
  //     expect(fn).toHaveBeenCalledTimes(1);
  //     expect(foo.bar.a).toBe(2);
  //     foo.bar.b.c = 3;
  //     expect(fn).toHaveBeenCalledTimes(2);
  //     expect(foo.bar.b.c).toBe(3);
  //     foo.bar.d.e.f = 4;
  //     expect(fn).toHaveBeenCalledTimes(3);
  //     expect(foo.bar.d.e.f).toBe(4);
  //   });
  //   test('we can watch the object after you reset', () => {
  //     foo.bar = {
  //       a: 1,
  //       b: {
  //         c: 2
  //       },
  //       d: {
  //         e: {
  //           f: 3
  //         }
  //       }
  //     };
  //     expect(fn).toHaveBeenCalledTimes(1);
  //     foo.bar.a = 2;
  //     expect(fn).toHaveBeenCalledTimes(2);
  //     expect(foo.bar.a).toBe(2);
  //     foo.bar.b.c = 3;
  //     expect(fn).toHaveBeenCalledTimes(3);
  //     expect(foo.bar.b.c).toBe(3);
  //     foo.bar.d.e.f = 4;
  //     expect(fn).toHaveBeenCalledTimes(4);
  //     expect(foo.bar.d.e.f).toBe(4);
  //   });
  // });
});
