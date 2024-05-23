import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import sharp from 'sharp';

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

export function isNameLengthValid(line: string): boolean {
    return line.length > 1 && line.length <= 20;
}

export function isIDValid(id: string): boolean {
    return id.length === 36;
}

export function removeLast(str:string, substring:string) {
    const index = str.lastIndexOf(substring);
    if (index === -1) {
        // The substring was not found in the string
        return str;
    }
    return str.slice(0, index) + str.slice(index + substring.length);
}

export async function resizeImage(file:string, resolutions:number[], deleteOld:boolean = false){
    const names: string[] = [];
    const metadata = await sharp(file).metadata();
    if (!metadata || !metadata.height || !metadata.width) return [];
    const minDimension = Math.min(metadata.width, metadata.height);
    const left = (metadata.width - minDimension) / 2;
    const top = (metadata.height - minDimension) / 2;
    
    resolutions.filter(resolution => resolution > 0 && resolution <= minDimension);
    for (const resolution of resolutions) {
        sharp(file)
            .extract({left: left, top: top, width: minDimension, height: minDimension})
            .resize(resolution,resolution)
            .toFile(`${removeLast(file, ".")}_${resolution}.webp`)
            .catch((err) => {
                console.error(`Failed to resize image ${file} to ${resolution}: ${err}`);
            });
        names.push(`${removeLast(file, ".")}_${resolution}.webp`);
    }
    if (deleteOld) {
        await deleteFile(file);
    }else {
        await fs.rename(file, `${removeLast(file, ".")}_original.webp`);
        names.push(`${removeLast(file, ".")}_original.webp`);
    }
    return names;
}

export async function convertToWebp(file: string, deleteOld: boolean,outName:string|null = null): Promise<string[] | null> {
    const webp = require('webp-converter');
    const newFile =  outName ? `${outName}` : `${removeLast(file, ".")}.webp`;
    
    const result = webp.grant_permission(file, `${newFile}`, "-q 80");

    if (result === '100') {
        if (deleteOld) {
            await deleteFile(file)
        }
        return await resizeImage(newFile, [32, 64, 128,256, 512, 1024, 2048]);
    } else {
        console.error(`Failed to convert file ${file} to WebP: ${result}`);
        return null;
    }
}