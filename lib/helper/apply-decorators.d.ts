export default function applyDecorators(Class: any, props: {
    [x: string]: Array<PropertyDecorator | MethodDecorator | ClassDecorator> | PropertyDecorator | MethodDecorator | ClassDecorator;
} | PropertyDecorator | MethodDecorator | ClassDecorator | Array<PropertyDecorator | MethodDecorator | ClassDecorator>, { self, omit, }?: {
    self?: boolean;
    omit?: boolean;
}): any;
