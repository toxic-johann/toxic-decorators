# toxic-decorators

[![Build Status](https://img.shields.io/travis/toxic-johann/toxic-decorators/master.svg?style=flat-square)](https://travis-ci.org/toxic-johann/toxic-decorators.svg?branch=master)
[![Coverage Status](https://img.shields.io/coveralls/toxic-johann/toxic-decorators/master.svg?style=flat-square)](https://coveralls.io/github/toxic-johann/toxic-decorators?branch=master)
[![npm](https://img.shields.io/npm/v/toxic-decorators.svg?colorB=brightgreen&style=flat-square)](https://www.npmjs.com/package/toxic-decorators)
[![npm download times](https://img.shields.io/npm/dm/toxic-decorators.svg)](https://www.npmjs.com/package/toxic-decorators)
[![dependency Status](https://david-dm.org/toxic-johann/toxic-decorators.svg)](https://david-dm.org/toxic-johann/toxic-decorators)
[![devDependency Status](https://david-dm.org/toxic-johann/toxic-decorators/dev-status.svg)](https://david-dm.org/toxic-johann/toxic-decorators?type=dev)



> Inspired by [core-decorators written by jayphelps](https://github.com/jayphelps/core-decorators.js). I think decorators will one powerful util for developer. So I create some function I want to use.

Library of [JavaScript stage-0 decorators](https://github.com/wycats/javascript-decorators) (aka ES2016/ES7 decorators [but that's not accurate](https://medium.com/@jayphelps/please-stop-referring-to-proposed-javascript-features-as-es7-cad29f9dcc4b)) include methods like @autobind, @waituntil, @alias etc. It's mainly focus on some useful methods to help us create javascript application.

If you have any idea of function you want. Please tell me or help me.

## state of decoratos

>Most of the paragraph below  is mainly quoted from  [core-decorators written by jayhelps](https://github.com/jayphelps/core-decorators.js).
>
>These are stage-0 decorators because while [the decorators spec has changed](http://tc39.github.io/proposal-decorators/) and is now stage-2, no transpiler has yet to implement these changes and until they do, this library won't either. Although the [TypeScript documentation](http://www.typescriptlang.org/docs/handbook/decorators.html)uses the phrase "Decorators are a stage 2 proposal for JavaScript" this is misleading because TypeScript still only implements the **stage-0** version of the spec, which is very incompatible with stage-2 (as of this writing). Though we have [babel-plugin-transform-decorators-stage-2-initial](https://github.com/jkrems/babel-plugin-transform-decorators-stage-2-initial) to translate stage-2 version of decorators. But the author do not encourage us to use it.
>
>So I think we will support stage-2 when we have mature compiler.

## Get start

**npm**

A version compiled to ES5 in CJS format is published to npm as [toxic-decorators](https://www.npmjs.com/package/toxic-decorators).

If you want to use it in Node.js.

```sh
npm install --save toxic-decorators
```

If you want to use it in the front-end project, I encourage you to use:

```sh
npm install --save-dev toxic-decorators
```

**just get the code**

You can get the compiled code in the `lib` file

* `lib/toxic-decorators.js`  cjs version, require babel-runtime
* `lib/toxic-decorators.mjs`  es version, which face to js:next require babel-runtime
* `lib/toxic-decorators.browser.js`  umd version, which you can use in the browser, but maybe you will need to add babel-polyfill in some situation.
* `lib/toxic-decorators.min.js` minify version based on umd version.

## Decorators

**For Properties a Methods**

* [@accessor](#accessor)
* [@alias](#alias)
* [@enumerable](#enumerable)
* [@initialize](#initialize)
* [@nonconfigurable](#nonconfigurable)
* [@configurable](#configurable)
* [@readonly](#readonly)
* [@frozen](#frozen)
* [@lock](#lock)

**For Properties**

* [@initString](#initstring)
* [@initNumber](#initnumber)
* [@initArray](#initarray)
* [@initBoolean](#initboolean)
* [@alwaysString](#alwaysstring)
* [@alwaysNumber](#alwaysnumber)
* [@alwaysArray](#alwaysarray)
* [@alwaysBoolean](#alwaysboolean)
* [@lazyInit](#lazyinit)
* [@nonextendable](#nonextendable)
* [@watch](#watch)

**For Methods**

* [@autobind](#autobind)
* [@before](#before)
* [@after](#after)
* [@waituntil](#waituntil)
* [@runnable](#runnable)

**For Classes**

* [@autobind](#autobind)
* [@autobindClass](#autobindclass)
* [@beforeClass](#beforeClass)
* [@afterClass](#afterClass)
* [@waituntilClass](#waituntilClass)
* [@runnableClass](#runnableClass)

## Helpers

* [applyDecorators()](#applydecorators)
* [classify()](#classify)

## Utils

* [getOwnKeys](#getOwnKeys)
* [getOwnPropertyDescriptors](#getOwnPropertyDescriptors)

## Docs

### @accessor

Set getter/setter hook on any properties or methods. In fact, it will change all kind of descriptors into an accessor descriptor.

**arguments**

* **handler**: `Object`
  * get: `Function | Array<Function>`
  * set: `Function | Array<Function>`
* **option**: `Object`
  * preSet: `boolean`
  * preGet: `boolean`

```javascript
import {accessor, applyDecorators} from 'toxic-decorators';

class Foo {
  bar = 1;
  constructor () {
    applyDecorators(this, {
      bar: accessor({
        get (value) {
          // must return value here
          return ++value;
        },
        set (value) {
          return ++value
        }
      })
    }, {self: true});
  }
}

console.log(foo.bar); // 2
foo.bar = 3;
console.log(foo.bar); // 5
```

> The example may be werid. You may wonder [why we can not use @accessor on InitializeInstanceFields directy?](#why-we-can-not-use-accessor-on-initializeinstancefields-directy)

### @alias

Help you to set alias for properties  on any instance or for methods on any class.

**arguments**

* **other**: `non-primitive` *optional* the other instance you want set alias on
* **name**: `string` the alias name
* options: `object` *optional*
  * force: `boolean`
    * when it's true, we will redifine the exiting property, otherwise, we will throw an error when we find you are setting alias on existing property
    * But it's impossible to do something on frozen value.
  * omit: `boolean`
    * when it's true, we will just skip the existing property.

```javascript
import {alias, applyDecorators} from 'toxic-decorators';

class Cat {};
const cat = new Cat();
class Dog {
  @alias('run')
  @alias('run', Cat.prototype)
  @alias('move', cat)
  move() {
    console.log('it moved');
  }
  age = 1;
  construcotr () {
    applyDecorators(this, {
      age: [alias('old'), alias('age', cat)]
    }, {self: true})
  }
}
const dog = new Dog();
const antoherCat = new Cat();
dog.move(); // it moved
dog.run(); // it moved
cat.run(); // it moved
anotherCat.run(); // it moved
cat.move(); // it moved
console.log(anotherCat.move === undefined); // true
console.log(cat.age); // 1
console.log(dog.old); // 1
```

> You can also set alias on getter/setter too.
>
> But there's one problem is we will set the alias until the origin one has been initialized.
>
> It means that you must get access to your origin property before you get access to your alias property, otherwise the alias one will be undefined.
>
> You may wonder [why we can not use @accessor on InitializeInstanceFields directy?](#why-we-can-not-use-accessor-on-initializeinstancefields-directy)

### @configurable

Set a property's configurable to be `true`. 

>  You can know more why I bump into this problem by [why configurable of InitializeInstanceFields is false when I use decorators on it?](#why-configurable-of-initializeinstancefields-is-false-when-i-use-decorators-on-it)

**arguments** none.

```javascript
import {configurable, initString} from 'toxic-decorators';

class Foo {
  @configurable
  @initString()
  bar = '123';
}
delete foo.bar;
```

### @nonconfigurable

Makes a porperty or method so that they cannot be deleted. Also accroding to the specification, it can prevent them from editing via `Object.defineProperty`. But it doesn't work quiet well. In that situation,  [@readonly](#readonly) may be a better choice.

**arguments** none.

```javascript
import {nonconfigurable} from 'toxic-decorators';

class Foo {
  @nonconfigurable
  bar = 1;
}
delete foo.bar; // Cannot delete property 'bar' of #<Foo>"
```

### @enumerable

Marks a property or method as being enumerable. As we know, property is enumerable by default.

**arguments** none.

```javascript
import {enumerable} from 'toxic-decoarators';

class Foo {
  @enumerable
  bar () {}
  car () {}
}

const foo = new Foo();
for (const key in foo) console.log(key);
// bar
```

### @nonenumerable

Marks a property as not being enumerable. Note that methods aren't enumerable by default.

**arguments** none.

```javascript
import {nonenumerable} from 'toxic-decorators';

class Foo {
  @nonenumerable
  a = 1;
  b = 2;
}

const foo = new Foo();
for (const key in foo) console.log(key); // b
```

### @initialize

Help you to do something when you initialize your property or function.

**arguments** 

* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```javascript
import {initialize} from 'toxic-decorators';

class Foo {
  @initialize(function (value) {
    return ++value;
  })
  bar = 1;
};
const foo = new Foo();
console.log(foo.bar); // 2;
foo.bar = 3;
console.log(foo.bar); // 3
```

> You can use this on getter/setter, too. Once you use that, we will always run the initialze function that until you set the value again.

### @readonly

You cannot write the porperty again.

**arguments** none

```javascript
import { readonly } from 'toxic-decorators';

class Meal {
  @readonly
  entree = 'steak';
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot assign to read only property 'entree' of [object Object]
```

You can also use readonly on getter/setter, but there is something you should pay attention.

We have just remove the setter here. But you getter stillreturn the origin value. You can change the origin value.

```javascript
import { readonly } from 'toxic-decorators';

let dish = 'steak'

class Meal {
  @readonly
  get entree () {return dish};
  set entree (value) {
    dish = value;
    return dish
  }
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot set property dinner of #<Meal> which has only a getter
dish = 'salmon';
console.log(dinner.entree); // 'salmon'
```

### @frozen

We will totally freeze the property. It can not be rewrite, delete or iterate.

**arguments** none

```javascript
import { frozen } from 'toxic-decorators';

class Meal {
  @frozen
  entree = 'steak';
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot assign to read only property 'entree' of [object Object]
delete dinner.entree;
// Cannot delete property 'entree' of #<Meal>"
```

You can also set the getter/setter property frozen. In this way, it's value could change once it's settle down.

```javascript
import { frozen } from 'toxic-decorators';

let dish = 'steak'

class Meal {
  @frozen
  get entree () {return dish};
  set entree (value) {
    dish = value;
    return dish
  }
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot set property dinner of #<Meal> which has only a getter
dish = 'salmon';
console.log(dinner.entree); // 'steak'
```

> Note: Escpecially on property, Once you set frozen, it can't be change, even with decorators. So you may better put it on the top.

### @lock

We will totally lock the property. It can not be rewrite, delete. But we would not force it be nonenumerable.

**arguments** none

```javascript
import { lock } from 'toxic-decorators';

class Meal {
  @lock
  entree = 'steak';
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot assign to read only property 'entree' of [object Object]
delete dinner.entree;
// Cannot delete property 'entree' of #<Meal>"
```

You can also set the getter/setter property locked. In this way, it's value could change once it's settle down.

```javascript
import { frozen } from 'toxic-decorators';

let dish = 'steak'

class Meal {
  @lock
  get entree () {return dish};
  set entree (value) {
    dish = value;
    return dish
  }
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot set property dinner of #<Meal> which has only a getter
dish = 'salmon';
console.log(dinner.entree); // 'steak'
```

> Note: Escpecially on property, Once you set locked, it can't be change, even with decorators. So you may better put it on the top.

### @initString

Ensure a property's initial value must be string. You can also pass another function as you want. It's just a grammar sugar for [@initialize](#initialize).

**arguments** 

* **defaultValue** *optional* set the default value when value is not string
* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```Javascript
import {initString} from 'toxic-decorators';

const info = {
  name: 'Kobe Bryant',
  champions: 5
};
class Intro {
  @initString(value => value.toLowerCase())
  name = info.name
  @initString(value => value.toLowerCase())
  champions = info.champions
}
const intro = new Intro();
console.log(intro.name); // kobe bryant
console.log(intro.champions); // ''
```

### @initNumber

Ensure a property's initial value must be number. You can see the detial in [@intiString](#initString)

### @initBoolean

Ensure a property's initial value must be boolean. You can see the detial in [@intiString](#initString)

### @initArray

Ensure a property's initial value must be Array. You can see the detial in [@intiString](#initString).

### @alwaysString

Ensure the property's value always be string. We change the property into getter/setter to implement this. It's a grammar sugar for [@accessor](#accessor).

**arguments** 

* **defaultValue** *optional* set the default value for situation that value is not string
* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```Javascript
import {alwaysString, applyDecorators} from 'toxic-decorators';

class Intro {
  name = 'BEN';
  constructor () {
    applyDecorators(this, {
      name: initString(value => value.toLowerCase())
    }, {self: true});
  }
}
const intro = new Intro();
console.log(intro.name); // ben
intro.name = 'JONES';
console.log(intro.name); // jones
```

> You may wonder [why we can not use @accessor on InitializeInstanceFields directy?](#why-we-can-not-use-accessor-on-initializeinstancefields-directy)

### @alwaysNumber

Ensure the property's value always be number. You can see the detail in [@alwaysString](#alwaysString)

### @alwaysBoolean

Ensure the property's value always be boolean. You can see the detail in [@alwaysString](#alwaysString)

### @alwaysArray

Ensure the property's value always be Array. You can see the detail in [@alwaysString](#alwaysString)

### @lazyInit

Prevents a property initializer from running until the decorated property is actually looked up. Useful to prevent excess allocations that might otherwise not be used, but be careful not to over-optimize things.

**arguments** none.

```javascript
import { lazyInit } from 'toxic-decorators';

function createHugeBuffer() {
  console.log('huge buffer created');
  return new Array(1000000);
}

class Editor {
  @lazyInit
  hugeBuffer = createHugeBuffer();
}

var editor = new Editor();
// createHugeBuffer() has not been called yet

editor.hugeBuffer;
// logs 'huge buffer created', now it has been called

editor.hugeBuffer;
// already initialized and equals our buffer, so
// createHugeBuffer() is not called again
```

### @nonextendable

To make the object property could not be extend.

```javascript
import { nonextendable} from 'toxic-decorators';

class Foo {
  @nonextendable
  bar = {
    a: 1
  }
}

const foo = new Foo();
foo.bar.b = 2; // error!!
```

### @watch

Watch a property. We will call the function you provide once we detect change on the value.

**arguments**

- **keyOrFn1** `string |Function` the string points to a function or just a function, it will be called once property is changed
- **keyOrFn2** `string |Function` the string points to a function or just a function, it will be called once property is changed
- … and so on
- **option** `Object` optional
  - **deep** `boolean`
    - `true` we will call you method if we get change on content of object or array
    - `false` we would not care about the change on content of object or array
    - default is `false`
  - **diff** `boolean`
    - `true` we will only call your method if the new value is different from the old value
    - `false` we will call the method once you set the property
    - default is `true`
  - **omit** `boolean`
    - `true` we will omit some error in watch decorator
    - `false` we will throw out the error
    - default is `false`
  - **proxy** `boolean`
    - `true` we will use `Proxy` (if browser support) to spy on object and array. In this way,  you can set and delete property as you want. But you should be care about the proxy value, we will talk about that later. And proxy mode also support `__set` and `__del`.
    - `false` we will use `Object.defineProperty` to spy on object and array. In this way, you should use `__set` or `__del` to set and delete property.
    - default is `false`
  - **other** non-primitive
    - if you offer this, and you function is pass as string. We use the string to look up function on this instance
  - **operationPrefix** `string`
    - if you don't want to use `__set` and `__del` as method, you can change their prefix by using this property.

Now we will show how to use `@watch`

```javascript
import {watch, applyDecorators} from 'toxic-decorators';
function fn (newVal, oldVal) {console.log(newVal, oldVal)}
class Foo {
  bar = 1;
  constructor () {
    applyDecorators(this, {
      bar: watch(fn)
    }, {self: true});
  }
}
const foo = new Foo();
foo.bar = 2;// 2, 1
```

`@watch` can detect change on the content of object and array, if you set deep true

```javascript
import {watch, applyDecorators} from 'toxic-decorators';
function fn (newVal, oldVal) {console.log(newVal, oldVal)}
class Foo {
  bar = [1, 2, 3];
  baz = {
    a: 1
  };
  constructor () {
    applyDecorators(this, {
      bar: watch(fn, {deep: true}),
      baz: watch(fn, {deep: true})
    }, {self: true});
  }
}
const foo = new Foo();
foo.bar.push(4); // [1, 2, 3, 4], [1, 2, 3, 4]
foo.baz.a = 2; // {a: 2}, {a: 2}
```

If you're sure your environment support `Proxy`,  you can use proxy mode

```javascript
import {watch, applyDecorators} from 'toxic-decorators';
function fn (newVal, oldVal) {console.log(newVal, oldVal)}
class Foo {
  baz = {
    a: 1
  };
  constructor () {
    applyDecorators(this, {
      baz: watch(fn, {deep: true, proxy: true})
    }, {self: true});
  }
}
const foo = new Foo();
foo.baz.b = 2; // {a: 1, b: 2}, {a: 1, b: 2}
delete foo.baz.b; // {a: 1}, {a: 1}
```

If you're not sure you support `Proxy`, or you don't want to use proxy mode. You can change content with  `__set` and `__del`, which will also trigger the change method.

```javascript
import {watch, applyDecorators} from 'toxic-decorators';
function fn (newVal, oldVal) {console.log(newVal, oldVal)}
class Foo {
  baz = {
    a: 1
  };
  constructor () {
    applyDecorators(this, {
      baz: watch(fn, {deep: true, proxy: false})
    }, {self: true});
  }
}
const foo = new Foo();
foo.baz.__set('b', 2); // {a: 1, b: 2}, {a: 1, b: 2}
foo.baz.__del('b'); // {a: 1}, {a: 1}
```

> If you use proxy mode, you should pay attention on proxy value. As we know
>
> ```javascript
> const obj = {a: 1};
> console.log(obj === new Proxy(obj, {})); // false
> ```
>
> Once you set an object on the property watch by proxy, it is bind with proxy object. So if you set original object on it again, it will trigger the method.
>
> ```javascript
> import {watch, applyDecorators} from 'toxic-decorators';
> const obj = {a: 1};
> function fn (newVal, oldVal) {console.log('changed')}
> class Foo {
>   bar = obj;
>   baz = obj;
>   constructor () {
>     applyDecorators(this, {
>       bar: watch(fn, {deep: true}),
>       baz: watch(fn, {deep: true, proxy: true})
>     }, {self: true});
>   }
> }
> foo.bar = obj;
> foo.baz = obj; // changed
> ```
> You may wonder [why we can not use @accessor on InitializeInstanceFields directy?](#why-we-can-not-use-accessor-on-initializeinstancefields-directy)
>

### @autobind

Forces invocation of this function to always have `this` refet to the class instance, even if the class  is passed around or would otherwise lose its `this`. e.g. `const fn = context.method`.

You can use it on the methods.

**arguments** none.

```javascript
import { autobind } from 'toxic-decorators';

class Person {
  @autobind
  getPerson() {
  	return this;
  }
}

const person = new Person();
const { getPerson } = person;

getPerson() === person;
// true
```

 You can use it on entire class, it will bind all methods of the class.

```Javascript
import { autobind } from 'toxic-decorators';

@autobind
class Person {
  getPerson() {
    return this;
  }

  getPersonAgain() {
    return this;
  }
}

const person = new Person();
const { getPerson, getPersonAgain } = person;

getPerson() === person;
// true

getPersonAgain() === person;
// true
```

Well, sometime we have lots of methods of class to bind, but not all of them. So we maybe need to exclude some of them. In this situation, you can use [@autobindClass](#autobindClass).

### @before

You can add your preprocessor here on your methods.Mostly, we will use this to do some arguments check.

**arguments** 

* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```javascript
import {before} from 'toxic-decorators';

class Foo {
  @before(function (a, b) {
    if(typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('only accept number');
    }
    // return the arguments in array
    return [a, b];
  })
  sum (a, b) {
    return a + b;
  }
}
const foo = new Foo();
foo.sum(1, 3); // 4
foo.sum('1', 3); // only accept number
```

### @after

You can add your postprocessor here on your methods.

**arguments** 

* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```javascript
import {before} from 'toxic-decorators';

class Foo {
  @after(function (ret) {
    return ret + 1;
  })
  sum (a, b) {
    return a + b;
  }
}
const foo = new Foo();
foo.sum(1, 3); // 5
```

### @runnable

In some situation, you may want your method could not be called. You can use [@waituntil](#waituntil) to implement this. But it may cost too much. So we offer you this method.

**arguments**

* **handler** `Function | string`
  * `Function` will tell us can we call the function
    * `return true;` we will call the method
    * else we would not call the method
  * `string`
    * the string indicate the property's name. We will fetch the property
    * if the property's value is `true`, we will call the method
    * else we would not call it
* **option**
  - **other** `non-primitive`
    - optional
    - only useful when handler is `string`
    - if it exist, we will look up the property on this instance
    - else, we will look up on the class itself
  - **backup** `Function`
    - optional
    - when backup is not a function, we will just skip the original method and do nothing
    - if you provide a backup function, we will called it.
    - It's useful if you want to throw out some error, when people call your method, but it's not runnable.

```javascript
import {runnable} from 'toxic-decorators';
class Foo {
  @runnable('b', {backup () {console.error('it is not runnable now');}})
  a () {
    console.log('i have been called');
  }
  b = false;
}

const foo = new Foo();
foo.a(); // it is not runnable now
foo.b = true;
foo.a(); // i have been called
```

### @waituntil

In some situation, our application is not ready. But others can call our function. We hope that they can wait for us. This decorators can let your function do not run until the flag is true

**arguments**

* **handler** `Function | Promise<*> | string`
  * `Function` will tell us can we call the function
    * `return promise` , we will wait until resolved
    * `return true`, we will run immediately
    * `return false`, we would not run it.
    * when you return promise, your function will become an **asynchronous** function.
    * when you return false, your call will be throw away and **never run**.
  * `Promise<*>`, we will wait until resolved.
    *  your function will become an **asynchronous** function.
  * `string` **recommend**
    * we will get the property and spy on it according to the string.
    * if the property do not equal to true when the function is called, we will put the function into waiting queue.
    * once the property become true, we will run the function in the waiting queue
    * if the property is true when the function is called, we will run the function immediately.
* **option**
  * **other** `non-primitive`
    * optional
    * only useful when handler is `string`
    * if it exist, we will look up the property on this instance
    * else, we will look up on the class itself

```Javascript
import {waituntil} from 'toxic-decorators';
let promiseResolve;
class Bar {
  flag = false;
}
const bar = new Bar();
class Foo {
  ready = new Promise(resolve => {promiseResolve = resolve});
  @waituntil(function () {return this.ready})
  runUntilPromise () {
    console.log('Promise is resolve!');
  }
  @waituntil(function () {return bar.flag});
  runUntilTrue () {
    console.log('flag is true!');
  }
  @waituntil('flag', bar);
  runUntilReady () {
    console.log('bar.flag is true!');
  }
}
const foo = new Foo();
foo.runUntilPromise();
foo.runUntilTrue();
foo.runUntilReady();
bar.flag = true;
// bar.flag is true!
foo.runUntilTrue();
// flag is true!
promiseResolve();
setTimeout(async () => {
  // Promise is resolve!
  foo.runUntilPromise();
  await foo.ready;
  // Promise is resolve!
}, 0)
```

### @autobindClass

When you not pass options. [@autobindClass](#autobindClass) does totally the same as [@autobind](#autobind). It can decorate all the method of the class.

[@autobindClass](#autobindClass) is created by [@classify](#classify), so it's arguments it's the same as the classifiedDecorator's arguments in [@classify](#classify).

```Javascript
import {autobindClass} from 'toxic-decorators';

@autobindClass({exclude: ['b']})
class Foo {
  a () {
    return this;
  }
  b () {
    return this;
  }
}

const foo = new Foo();
const {a, b} = foo;
a() === foo; // true
b() === foo; // false
```

### @beforeClass

[@beforeClass](#beforeClass) is created by [@classify](#classify) and [@before](#before), so it's arguments it's the same as the classifiedDecorator's arguments in [@classify](#classify) and [@before](#before).

```javascript
import {beforeClass} from 'toxic-decorators';
import {isFunction} from 'toxic-predicate-functions';

@beforeClass({}, () => console.log('i am called before'))
class Foo {
  a () {
    console.log('i am a');
  }
  b () {
    console.log('i am b');
  }
}
const foo = new Foo();
foo.a();
// i am called before
// i am a
foo.b();
// i am caleed before
// i am b
```

### @afterClass

[@afterClass](#afterClass) is created by [@classify](#classify) and [@after](#after), so it's arguments it's the same as the classifiedDecorator's arguments in [@classify](#classify) and [@after](#after).

```javascript
import {afterClass} from 'toxic-decorators';
import {isFunction} from 'toxic-predicate-functions';

@afterClass({}, () => console.log('i am called after'))
class Foo {
  a () {
    console.log('i am a');
  }
  b () {
    console.log('i am b');
  }
}
const foo = new Foo();
foo.a();
// i am a
// i am called after
foo.b();
// i am b
// i am caleed after
```

### runnableClass

[@runnableClass](#runnableClass) is created by [@classify](#classify) and [@runnable](#runnable), so it's arguments it's the same as the classifiedDecorator's arguments in [@classify](#classify) and [@runnable](#runnable).

```javascript
import {runnableClass} from 'toxic-decorators';
@runnableClass({}, 'b', {backup () {console.error('it is not runnable now');}})
class Foo {
  a () {
    console.log('i have been called');
  }
  b = false;
}

const foo = new Foo();
foo.a(); // it is not runnable now
foo.b = true;
foo.a(); // i have been called
```

### waituntilClass

[@waituntilClass](#waituntilClass) is created by [@classify](#classify) and [@waituntil](#waituntil), so it's arguments it's the same as the classifiedDecorator's arguments in [@classify](#classify) and [@waituntil](#waituntil).

```javascript
import {waituntilClass} from 'toxic-decorators';
let promiseResolve;
class Bar {
  flag = false;
}
const bar = new Bar();
@waituntilClass({}, function () {return bar.flag});
class Foo {
  runUntilTrue () {
    console.log('flag is true!');
  }
}
const foo = new Foo();
foo.runUntilTrue();
bar.flag = true;
foo.runUntilTrue();
// flag is true!
```

### applyDecorators()

If you want to use decorators, you may need to use [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) to compile. What if you don't want to use that. You can use `applyDecorators`.

**arguments**

* **Class** the class you want to handle
* **props** `{[string]: Function | Array<Function>}` the props map and their handler
* **option**
  * **self** `boolean` 
    * `false` we will handle on the `Class.prototype`
    * `true` we will handle on the Class itself
    * default is false
  * **omit** `boolean`
    * If you want to apply decorators on unconfigurable property, it will throw error
    * `false` to throw out the error
    * `true` to omit the error
    * default is false

```javascript
import {applyDecorators, before} from 'toxic-decorators';

class Person {
  run () {
    console.log('i am running');
  }
  walk () {
    console.log('i am walking');
  }
}

// Besides class, you can also use normal function like `function foo {}`
applyDecorators(Foo, {
  // you can add only one function
  walk: before(() => console.log('go')),
  run: [before(() => console.log('ready')), before(() => console.log('go'))]
});

const foo = new Foo();
foo.walk();
// go
// i am walking
foo.run();
// ready
// go
// i am running
```

In the way above, we can apply decorators on function's prototype. That's enough for methods. But what if we want to apply some property decorators.

You can act like above, but it will modify portotype's property. They make take effect on multiple instance, and it's works bad on some situation.

So, if you want to apply decorators on property, I advice you to pass in an instance in self mode.

```javascript
import {initialize, applyDecorators} from 'toxic-decorators';

class Foo {
  a = 1;
  b = 2;
};
const foo = new Foo();
console.log(foo.a); // 1
console.log(foo.b); // 2

applyDecorators(foo, {
  a: initialize(function () {return 2;}),
  b: initialize(function () {return 3;})
}, {self: true});

console.log(foo.a); // 2
console.log(foo.b); // 3
```

What's more, you can also use applyDecorators to decorate the whole class.

**arguments**

* **Class** the class you want us to handle
* **decorators** `Function | Array<Function>` handlers

```Javascript
import {autobindClass, applyDecoratos} from 'toxic-decorators';

class Foo {
  a () {
    return this;
  }
  b () {
    return this;
  }
}

applyDecorators(Foo, autobindClass({exclude: ['b']}))
const foo = new Foo();
const {a, b} = foo;
a() === foo; // true
b() === foo; // false
```

### classify()

If you want to decorate your class. You should add `@decorator` before your class. But what if you don't want to  [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) . You can use classify to create a function to decorate your class.

What's more, adding `@decorator` before your class could only decorate the method. You may want to decorate the property too. In this situation, you may need to use the function created by `classify` with `self: true`.

**arguments**

* **decorator**
  * `Function`
  * the `decorator` you want to use
* **option**
  * **requirement**
    * `Function`
    * optional
    * if you do not offer requirement, we will decorate all property and method
    * if you offer us a requirement, we would not decorate the property and method if you return false
  * **customeArgs**
    * `boolean`
    * default: `false`
    * some decorator may support customArgs, you need to tell us that.

**return**

* **classifiedDecorator**
  * `Function`
  * the decorator which you can used on class
  * **arguments**
    * **option**
      * **exclude**
        * `Array<string>`
        * The name of property which you don't want to decorate
      * **include**
        * `Array<string>`
        * the name of property which is not exist now but you want to decorate on.
      * **construct**
        * `boolean`
        * Default: `false`
        * we will decorate the `constructor` if you set it  `true`
      * **self**
        * `boolean`
        * Default: `false`
        * when you want to decorate an instance, you should set `self` to be `true`, we will decorate the instance itself.
    * other arguments will be pass into the decorator

```javascript
import {before, classify} from 'toxic-decorators';
import {isFunction} from 'toxic-predicate-functions';
const beforeClass = classify(before, {
  requirement (obj, prop, desc) {
    return desc && isFunction(desc.value);
  },
  customArgs: true
});

@beforeClass({}, () => console.log('i am called before'))
class Foo {
  a () {
    console.log('i am a');
  }
  b () {
    console.log('i am b');
  }
}
const foo = new Foo();
foo.a();
// i am called before
// i am a
foo.b();
// i am caleed before
// i am b
```

## Need lodash utilities as decorators?

> We have mostly the same idea with core-decorators. So I just quote this from it's README.

toxic-decorators aims to provide decorators that are fundamental to JavaScript itself--mostly things you could do with normal `Object.defineProperty` but not as easily when using ES2015 classes. Things like debouncing, throttling, and other more opinionated decorators are being phased out in favor of [lodash-decorators](https://www.npmjs.com/package/lodash-decorators) which wraps applicable lodash utilities as decorators. We don't want to duplicate the effort of lodash, which has years and years of robust testing and bugfixes.

## Precautions

### why configurable of InitializeInstanceFields is false when I use decorators on it?

We all knows that, JavaScript class will support public fields later. But it bring use some problem.You can see in [this case](https://codepen.io/toxic-johann/pen/XgvGMy):

```javascript
function detect (obj, prop, descriptor) {
  console.log(obj, prop, descriptor);
  return descriptor;
}
class Foo {
  a = 1;
  @detect
  b = 2;
}
const foo = new Foo(); // {configurable: false, enumerable: true, initializer: function initializer(), writable: true}
console.log(Object.getOwnPropertyDescriptor(foo, 'a'), Object.getOwnPropertyDescriptor(foo, 'b'));
// {configurable: true, enumerable: true, value: 1, writable: true}, {configurable: false, enumerable: true, value: 2, writable: true}

```

Well, according to the [specification](https://tc39.github.io/proposal-class-fields/#sec-define-field). The configurable of public field shoud be `false`. But this will make us could not use configure it later.

In this situation, you should use [@configurable](#configuralbe).

### why we can not use @accessor on InitializeInstanceFields directy?

Decorators like accessor will turn initialze descirptor into accessor descriptor. According to [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy/blob/master/src/index.js#L67-L72), it will bind accessor descriptor to class's prototype. In other words, it's singleton.

That may bring us problem, for example:

```javascript
class Foo {
  @accessor({
    get (value) {
      return value;
    },
    set (value) {
      return value;
    }
  })
  bar = 1;
  baz = 2;
}
const foo1 = new Foo();
const foo2 = new Foo();
foo2.bar = 3;
console.log(foo1.bar, foo2.bar); // 3， 3
```

As value are all set on the `Foo.prototype`, once you set the value. It will change both instance.

However, if you do not rely on the value binding on the `Class.prototype`, that still work.

```javascript
class Foo {
  @accessor({
    get (value) {
      return this.baz;
    },
    set (value) {
      this.baz = value;
    }
  })
  bar = 1;
  baz = 2;
}
const foo1 = new Foo();
const foo2 = new Foo();
foo2.bar = 3;
console.log(foo1.bar, foo2.bar);
```

But it still have a problem. As it was bind on `prototype`, it can't be enumerable.

```javascript
class Foo {
  @accessor({
    get (value) {
      return this.baz;
    },
    set (value) {
      this.baz = value;
    }
  })
  bar = 1;
  baz = 2;
}
const foo = new Foo();
console.log(Object.keys(foo)); // ['baz']
```

So, I encourage you to use applyDecorators on InitializeInstanceFields with decorators like [@accessor](#accessor), [@alias](#alias).

## Changelog

Please read the [realase notes](https://github.com/Chimeejs/chimee/releases).

## License

[GPL-3.0](https://opensource.org/licenses/GPL-3.0)