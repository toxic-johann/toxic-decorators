// @flow
import initialize from 'initialize';
import {isNumber} from 'helper/utils';
export default function number (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isNumber(value) ? value : 0;
  });
  return initialize(...args);
}
