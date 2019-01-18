import { isFunction, isString } from 'lodash';
import accessor from '../accessor';
export default function string(
  defaultValue?: string | ((v: any) => any),
  // tslint:disable-next-line: trailing-comma
  ...args: Array<(v: any) => any>
): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = '';
  } else if (!isString(defaultValue)) {
    defaultValue = '';
  }
  args.unshift(function(value) {
    return isString(value) ? value : defaultValue;
  });
  return (accessor({ set: args, get: args }) as PropertyDecorator);
}
