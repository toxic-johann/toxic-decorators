export * from 'toxic-predicate-functions';
import { AccessorDescriptor, DataDescriptor, InitializerDescriptor } from '../typings/base';
export declare function isDescriptor(desc: any): desc is PropertyDescriptor;
export declare function isAccessorDescriptor(desc: any): desc is AccessorDescriptor;
export declare function isDataDescriptor(desc: any): desc is DataDescriptor;
export declare function isInitializerDescriptor(desc: any): desc is InitializerDescriptor;
export declare function createDefaultSetter(key: string): (newValue: any) => any;
export declare function compressOneArgFnArray<T>(fns: Array<(obj: T) => T>, errmsg?: string): (obj: T) => T;
export declare function warn(message: string): void;
export declare function getOwnKeysFn(): (obj: any) => (string | symbol)[];
export declare const getOwnKeys: (obj: any) => (string | symbol)[];
export declare function getOwnPropertyDescriptorsFn<T>(): (o: T) => {
    [P in keyof T]: TypedPropertyDescriptor<T[P]>;
} & {
    [x: string]: PropertyDescriptor;
};
export declare const getOwnPropertyDescriptors: (o: unknown) => {} & {
    [x: string]: PropertyDescriptor;
};
export declare function compressMultipleDecorators(...fns: Array<MethodDecorator | PropertyDecorator | ClassDecorator>): MethodDecorator | PropertyDecorator | ClassDecorator;
