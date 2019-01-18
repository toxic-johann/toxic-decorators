import { isArray, isFunction } from 'lodash';
import accessor from '../accessor';
export default function array(
  defaultValue?: any[] | ((v: any) => any),
  // tslint:disable-next-line: trailing-comma
  ...args: Array<(v: any) => any>
): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = [];
  } else if (!isArray(defaultValue)) {
    defaultValue = [];
  }
  args.unshift(function(value) {
    return isArray(value) ? value : defaultValue;
  });
  return (accessor({ set: args, get: args }) as PropertyDecorator);
}
