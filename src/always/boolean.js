// @flow
import accessor from 'accessor';
import {isBoolean} from 'helper/utils';
export default function boolean (...args: Array<Function>): Function {
  const defaultValue = isBoolean(args[0])
    ? args.shift()
    : false;
  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return accessor({set: args, get: args});
}
