export default function accessor({ get, set, }?: {
    get?: ((v: any) => any) | Array<(v: any) => any>;
    set?: ((v: any) => any) | Array<(v: any) => any>;
}, { preGet, preSet, }?: {
    preGet?: boolean;
    preSet?: boolean;
}): MethodDecorator | PropertyDecorator;
