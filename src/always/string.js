// @flow
import accessor from 'accessor';
import {isString} from 'helper/utils';
export default function string (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isString(value) ? value : '';
  });
  return accessor({set: args, get: args});
}
