// @flow
import accessor from 'accessor';
import {isArray} from 'helper/utils';
export default function array (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isArray(value) ? value : [];
  });
  return accessor({set: args, get: args});
}
