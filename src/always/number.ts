import accessor from 'accessor';
import { isFunction, isNumber } from 'lodash';
export default function number(
  defaultValue: number | ((v: any) => any),
  // tslint:disable-next-line: trailing-comma
  ...args: Array<(v: any) => any>
): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = 0;
  } else if (!isNumber(defaultValue)) {
    defaultValue = 0;
  }
  args.unshift(function(value) {
    return isNumber(value) ? value : defaultValue;
  });
  return (accessor({ set: args, get: args }) as PropertyDecorator);
}
