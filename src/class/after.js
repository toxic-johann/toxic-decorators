// @flow
import after from 'after';
import classify from 'helper/classify';
import {isFunction, isDataDescriptor} from 'helper/utils';
export default classify(after, {
  requirement (obj: any, prop: string, desc: Descriptor) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true
});