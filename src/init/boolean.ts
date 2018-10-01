import initialize from 'initialize';
import { isBoolean, isFunction } from 'lodash';
export default function boolean(
  defaultValue: boolean | ((x: any) => any),
  ...args: Array<(x: any) => any>): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = false;
  } else if (!isBoolean(defaultValue)) {
    defaultValue = false;
  }
  args.unshift(function(value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return (initialize(...args) as PropertyDecorator);
}
