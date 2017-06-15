// @flow
import initialize from 'initialize';
import {isArray} from 'helper/utils';
export default function array (...args: Array<Function>): Function {
  args.unshift(function (value) {
    return isArray(value) ? value : [];
  });
  return initialize(...args);
}
