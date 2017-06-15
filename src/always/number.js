// @flow
import accessor from 'accessor';
import {isNumber} from 'helper/utils';
export default function number (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isNumber(value) ? value : 0;
  });
  return accessor({set: args, get: args});
}
