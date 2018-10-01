import initialize from 'initialize';
import { isArray, isFunction } from 'lodash';
export default function array(
  defaultValue: any[] | ((x: any) => any),
  ...args: Array<(x: any) => any>): PropertyDecorator {
  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = [];
  } else if (!isArray(defaultValue)) {
    defaultValue = [];
  }
  args.unshift(function(value) {
    return isArray(value) ? value : defaultValue;
  });
  return (initialize(...args) as PropertyDecorator);
}
