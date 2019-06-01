import { isFunction } from 'lodash-es';
import before from '../before';
import classify from '../helper/classify';
import { isDataDescriptor } from '../helper/utils';
export default classify(before, {
  requirement(obj: any, prop: string, desc: PropertyDescriptor) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true,
});
