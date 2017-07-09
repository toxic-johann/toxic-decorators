// @flow
import {getOwnKeys, getOwnPropertyDescriptors, isVoid, isFunction, isArray} from 'helper/utils';
const {defineProperty} = Object;
export function classify (decorator: Function, {
  requirement
}: {
  requirement?: Function
} = {}): Function {
  return function ({exclude = []}: {exclude: Array<string>} = {}, ...args: any): Function {
    if(!isArray(exclude)) throw new TypeError('options.exclude must be an array');
    return function (Klass: Function): void {
      if(!isFunction(Klass)) throw new TypeError(`@${decorator.name}Class can only be used on class`);
      const {prototype} = Klass;
      if(isVoid(prototype)) throw new Error(`The prototype of the ${Klass.name} is empty, please check it`);
      const descs = getOwnPropertyDescriptors(prototype);
      const keys = getOwnKeys(prototype);
      for(let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];
        // $FlowFixMe: not support symbol yet
        const desc = descs[key];
        if(key === 'constructor' ||
          !isFunction(desc.value) ||
          // $FlowFixMe: not support symbol yet
          exclude.indexOf(key) > -1 ||
          isFunction(requirement) && !requirement(prototype, key, desc)) continue;
        defineProperty(prototype, key, decorator(prototype, key, desc));
      }
    };
  };
}
