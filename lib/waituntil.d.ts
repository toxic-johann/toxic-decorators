export default function waituntil(key: ((...args: any[]) => (Promise<any> | boolean)) | Promise<any> | string, { other }?: {
    other?: any;
}): MethodDecorator;
