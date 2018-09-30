export interface AccessorDescriptor {
  configurable: boolean;
  enumerable: boolean;
  get?(): any;
  set?(v: any): void;
}
export interface DataDescriptor {
  configurable: boolean;
  enumerable: boolean;
  writable: boolean;
  value: any;
}
export interface InitializerDescriptor {
  configurable: boolean;
  enumerable: boolean;
  writable: boolean;
  initializer(): any;
}

export interface PropertyOrMethodOrClassDecorator extends MethodDecorator, PropertyDecorator, ClassDecorator {
  (target: object, propertyKey: string | symbol): void;
}
