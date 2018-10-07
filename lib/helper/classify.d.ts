export default function classify(decorator: MethodDecorator | PropertyDecorator | ((...args: any[]) => (MethodDecorator | PropertyDecorator)), { requirement, customArgs, }?: {
    requirement?: (...args: any[]) => any;
    customArgs?: boolean;
}): (opt?: {
    exclude?: string[];
    include?: string[];
    construct?: boolean;
    self?: boolean;
}, ...args: any[]) => ClassDecorator;
