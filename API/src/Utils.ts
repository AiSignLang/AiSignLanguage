import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import sharp from 'sharp';
import * as https from "node:https";
import config from "./config";
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {writeFile} from "node:fs";

export const publicPath = path.join(__dirname, '../public/')

export const getUserPath = (username: string) => {
    return path.join(publicPath,`${username}/`);
}
export const getAvatarPath = (username: string) => {
    return path.join(getUserPath(username),`/avatars/`);
}
export const getStaticUrl = (urlPath:string) =>{
    return path.join(config.staticEndpoint, urlPath).replace(/\\/g, '/');
}

export async function downloadImage(url: string, dest: string):Promise<string> {
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    const resp = await axios.get(url, {responseType: 'stream'});
    const contentType = response.headers['content-type'];
    const extension = contentType.split('/')[1];
    const outFile = `${dest}/${uuidv4()}.${extension}`

    const buffer = Buffer.from(response.data, 'binary');
    writeFile(outFile, buffer, (err) => {
        if (err) throw err;
        console.log('Image saved!');
    });
    return outFile;
}

sharp.cache(false);


export function isString(value: any): void {
    if (typeof value !== 'string') {
        throw new Error('Value must be a string');
    }
}

export function isEnum(value: any, enumType: any): void {
    if (!Object.values(enumType).includes(value)) {
        throw new Error(`Value must be one of ${Object.values(enumType).join(", ")}`);
    }
}

export async function deleteFile(filePath: string):Promise<boolean> {
    
    try {
        await fs.unlink(filePath);
        return true;
    }catch (err){
        return false;
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
    return str.slice(0, index);
}

export async function resizeImage(file:string, resolutions:number[], deleteOld:boolean = false): Promise<string[]>{
    const names: string[] = [];
    const metadata = await sharp(file).metadata();
    if (!metadata || !metadata.height || !metadata.width) return [];
    const minDimension = Math.min(metadata.width, metadata.height);
    const left = (metadata.width - minDimension) / 2;
    const top = (metadata.height - minDimension) / 2;
    
    
    resolutions.filter(resolution => resolution > 0 && resolution <= minDimension);
    for (const resolution of resolutions) {
        const outFile = `${removeLast(file, ".")}_${resolution}.webp`;
        if(fsSync.existsSync(outFile)){
            await deleteFile(outFile)
        }
        const s = sharp(file)
            .extract({left: Math.round(left), top: Math.round(top), width: Math.round(minDimension), height: Math.round(minDimension)})
            .resize(resolution,resolution)
        await s.toFile(outFile).catch((err) => {
            console.error(`Error resizing image: ${err}`);
        });
        s.destroy();
        s.end();
        names.push(outFile);
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

    const bp = 10;
    const webp = require('webp-converter');
    const newFile =  outName ? `${path.dirname(file)}/${outName}.webp` : `${removeLast(file, ".")}.webp`;
    await webp.cwebp(file, `${newFile}`, "-q 80"); // TODO: switched to webp.cwebp(), but result equals "".
    const result = fsSync.existsSync(newFile);
    
    if(result){
        if (deleteOld) {
            await deleteFile(file)
        }
        return (await resizeImage(newFile, [32, 64, 128,256, 512, 1024, 2048])).map((name) => 
            name.split("public").at(-1)?.slice(1) ?? name);
    } else {
        console.error(`Failed to convert file ${file} to WebP: ${result}`);
        return null;
    }
}

export async function readFile(filePath: string, isAsync: boolean)  {
    try {
        return isAsync
            ? await fs.readFile(path.join(__dirname,filePath), 'utf-8')
            : fsSync.readFileSync(path.join(__dirname,filePath), 'utf-8');
    }catch (err){
        console.error(err);
        return  "";
    }
}