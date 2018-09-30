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

export type DecoratorFunction = (obj: any, prop: string, descirptor: PropertyDescriptor | void) => PropertyDescriptor;

export interface PropertyOrMethodDecorator extends MethodDecorator, PropertyDecorator {
  (target: object, propertyKey: string | symbol): void;
}
