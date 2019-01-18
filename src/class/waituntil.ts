import { isFunction } from 'lodash';
import classify from '../helper/classify';
import { isDataDescriptor } from '../helper/utils';
import waituntil from '../waituntil';
export default classify(waituntil, {
  requirement(obj: any, prop: string, desc: PropertyDescriptor) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true,
});
