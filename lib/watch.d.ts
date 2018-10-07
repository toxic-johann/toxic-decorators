export default function watch(...args: Array<string | ((...args: any[]) => any) | {
    deep?: boolean;
    diff?: boolean;
    omit?: boolean;
    proxy?: boolean;
    other?: any;
    operationPrefix?: string;
}>): PropertyDecorator;
