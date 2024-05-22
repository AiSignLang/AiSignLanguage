import * as path from "node:path";
import * as fs from "node:fs/promises";

export function isString(value: any): void {
    if (typeof value !== 'string') {
        throw new Error('Value must be a string');
    }
}

export async function deleteFile(filename: string) {
    const filePath = path.join(__dirname, '../public/avatars', filename);

    try {
        await fs.unlink(filePath);
    }catch (err){
        console.error(`Failed to delete file ${filePath}`, err);
    }
}

export function lengthValidation(line: string): boolean {
    return line.length > 1 && line.length <= 20;
}