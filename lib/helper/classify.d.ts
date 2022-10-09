declare type DecoratorCreatorType = ((...args: any[]) => (MethodDecorator | PropertyDecorator));
export default function classify(decorator: MethodDecorator | PropertyDecorator | DecoratorCreatorType, { requirement, customArgs, }?: {
    requirement?: (...args: any[]) => any;
    customArgs?: boolean;
}): (opt?: {
    exclude?: string[];
    include?: string[];
    construct?: boolean;
    self?: boolean;
}, ...args: any[]) => ClassDecorator;
export {};
