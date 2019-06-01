import { isFunction, isString } from 'lodash-es';
import initialize from '../initialize';
export default function string(
  defaultValue?: string | ((x: any) => any),
  ...args: Array<(x: any) => any>): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = '';
  } else if (!isString(defaultValue)) {
    defaultValue = '';
  }
  args.unshift(function(value) {
    return isString(value) ? value : defaultValue;
  });
  return (initialize(...args) as PropertyDecorator);
}
