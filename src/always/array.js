// @flow
import accessor from 'accessor';
import {isArray} from 'helper/utils';
export default function array (...args: Array<Function>): Function {
  const defaultValue = isArray(args[0])
    ? args.shift()
    : [];
  args.unshift(function (value) {
    return isArray(value) ? value : defaultValue;
  });
  return accessor({set: args, get: args});
}
