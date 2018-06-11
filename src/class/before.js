// @flow
import before from 'before';
import classify from 'helper/classify';
import { isDataDescriptor } from 'helper/utils';
import { isFunction } from 'lodash';
export default classify(before, {
  requirement(obj: any, prop: string, desc: Descriptor) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true,
});
