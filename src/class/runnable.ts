import { isFunction } from 'lodash-es';
import classify from '../helper/classify';
import { isDataDescriptor } from '../helper/utils';
import runnable from '../runnable';
export default classify(runnable, {
  requirement(obj: any, prop: string, desc: PropertyDescriptor) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true,
});
