declare type AliasOption = {
    force?: boolean;
    omit?: boolean;
};
declare function alias(other: string, key?: AliasOption): MethodDecorator | PropertyDecorator;
declare function alias(other: any, key: string, option: AliasOption): MethodDecorator | PropertyDecorator;
export default alias;
