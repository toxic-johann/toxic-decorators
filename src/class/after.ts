import { isFunction } from 'lodash-es';
import after from '../after';
import classify from '../helper/classify';
import { isDataDescriptor } from '../helper/utils';
export default classify(after, {
  requirement(obj: any, prop: string, desc: PropertyDescriptor) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true,
});
