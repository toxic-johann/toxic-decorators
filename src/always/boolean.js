// @flow
import accessor from 'accessor';
import {isBoolean} from 'helper/utils';
export default function boolean (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isBoolean(value) ? value : false;
  });
  return accessor({set: args, get: args});
}
