// @flow
import autobind from 'autobind';
import {getOwnKeys, getOwnPropertyDescriptors, isVoid, isFunction, isArray} from 'helper/utils';
const {defineProperty} = Object;
export default function autobindClass ({exclude = []}: {exclude: Array<string>} = {}): Function {
  if(!isArray(exclude)) throw new TypeError('options.exclude must be an array');
  return function (Klass: Function): void {
    if(!isFunction(Klass)) throw new TypeError('@autobindClass can only be used on class');
    const {prototype} = Klass;
    if(isVoid(prototype)) throw new Error('The prototype of the class is empty, please check it');

    const descs = getOwnPropertyDescriptors(prototype);
    const keys = getOwnKeys(prototype);

    for(let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      // $FlowFixMe: not support symbol yet
      const desc = descs[key];
      if(key === 'constructor' ||
        !isFunction(desc.value) ||
        // $FlowFixMe: not support symbol yet
        exclude.indexOf(key) > -1) continue;
      // $FlowFixMe: not support symbol yet
      defineProperty(prototype, key, autobind(prototype, key, desc));
    }
  };
}
