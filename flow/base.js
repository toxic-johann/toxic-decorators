declare type AccessorDescriptor = {|
  get?: Function,
  set?: Function,
  configurable: boolean,
  enumerable: boolean
|}

declare type DataDescriptor = {|
  value: any,
  configurable: boolean,
  writable: boolean,
  enumerable: boolean
|}

declare type InitialDescriptor = {|
  initializer: Function,
  configurable: boolean,
  writable: boolean,
  enumerable: boolean
|};

declare type Descriptor = DataDescriptor | AccessorDescriptor | InitialDescriptor;

