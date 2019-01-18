import { isBoolean, isFunction } from 'lodash';
import accessor from '../accessor';
export default function boolean(
  defaultValue: boolean | ((v: any) => any),
  // tslint:disable-next-line: trailing-comma
  ...args: Array<(v: any) => any>
): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = false;
  } else if (!isBoolean(defaultValue)) {
    defaultValue = false;
  }
  args.unshift(function(value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return (accessor({ set: args, get: args }) as PropertyDecorator);
}
