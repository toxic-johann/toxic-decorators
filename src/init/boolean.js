// @flow
import initialize from 'initialize';
import { isBoolean } from 'lodash';
export default function boolean(...args: Array<Function>): Function {
  const defaultValue = isBoolean(args[0])
    ? args.shift()
    : false;
  args.unshift(function(value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return initialize(...args);
}
