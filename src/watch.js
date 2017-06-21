// // @flow
// import {isFunction, isString, isPrimitive, getDeepProperty, bind} from 'helper/utils';
// import accessor from 'accessor';
// export default function (keyOrFn: string | Function, {deep, other}: {
//   deep: boolean,
//   omit: boolean,
//   other: any
// }): Function {
//   if(!isString(keyOrFn) || !isFunction(keyOrFn)) throw new TypeError('You must pass a function or a string to find the hanlder function.');
//   const illegalObjErrorMsg = 'If you want us to trigger function on the other instance, you must pass in a legal instance';
//   if(other !== undefined && isPrimitive(other)) throw new TypeError(illegalObjErrorMsg);
//   return function (obj: any, prop: string, descriptor: undefined | Descriptor): AccessorDescriptor {
//     const handler = isString(keyOrFn)
//     ? function (newVal, oldVal) {
//       const target = isPrimitive(other) ? obj : other;
//       const fn = getDeepProperty(target, keyOrFn);
//       if(!isFunction(fn)) {
//         if(!omit) throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
//         return function () {}
//       }
//       return fn;
//     }
//     : keyOrFn;
//     const hook = function () {}
//     if(descriptor === undefined) {
//       actt
//     }
//   };
// }
