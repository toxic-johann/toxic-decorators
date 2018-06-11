// @flow
import autobind from 'autobind';
import classify from 'helper/classify';
import { isDataDescriptor } from 'helper/utils';
import { isFunction } from 'lodash';
export default classify(autobind, {
  requirement(obj: any, prop: string, desc: Descriptor) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
});
