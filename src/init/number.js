// @flow
import initialize from 'initialize';
import {isNumber} from 'helper/utils';
export default function number (...args: Array<Function>): Function {
  const defaultValue = isNumber(args[0])
    ? args.shift()
    : 0;
  args.unshift(function (value) {
    return isNumber(value) ? value : defaultValue;
  });
  return initialize(...args);
}
