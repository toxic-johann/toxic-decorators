export default function runnable(key: (...args: any[]) => any | string, { other, backup, }?: {
    other?: any;
    backup?: (...args: any[]) => any;
}): MethodDecorator;
