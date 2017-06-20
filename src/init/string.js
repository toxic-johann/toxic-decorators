// @flow
import initialize from 'initialize';
import {isString} from 'helper/utils';
export default function string (...args: Array<Function>): Function {
  const defaultValue = isString(args[0])
    ? args.shift()
    : '';
  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return initialize(...args);
}
