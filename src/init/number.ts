import { isFunction, isNumber } from 'lodash';
import initialize from '../initialize';
export default function number(
  defaultValue: number | ((x: any) => any),
  ...args: Array<(x: any) => any>): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = 0;
  } else if (!isNumber(defaultValue)) {
    defaultValue = 0;
  }
  args.unshift(function(value) {
    return isNumber(value) ? value : defaultValue;
  });
  return (initialize(...args) as PropertyDecorator);
}
