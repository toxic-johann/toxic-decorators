// @flow
import initialize from 'initialize';
import {isBoolean} from 'helper/utils';
export default function boolean (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isBoolean(value) ? value : false;
  });
  return initialize(...args);
}
