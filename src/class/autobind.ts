import { isFunction } from 'lodash';
import autobind from '../autobind';
import classify from '../helper/classify';
import { isDataDescriptor } from '../helper/utils';
export default classify(autobind, {
  requirement(obj: any, prop: string, desc: PropertyDescriptor) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
});
