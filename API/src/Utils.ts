export function isString(value: any): void {
    if (typeof value !== 'string') {
        throw new Error('Value must be a string');
    }
}