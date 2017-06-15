// @flow
import initialize from 'initialize';
import {isString} from 'helper/utils';
export default function string (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isString(value) ? value : '';
  });
  return initialize(...args);
}
