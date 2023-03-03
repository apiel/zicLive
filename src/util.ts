import { constants } from 'fs';
import { access, lstat } from 'fs/promises';

export const minmax = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const truncate = (str: string, length: number) => (str.length > length ? `${str.substring(0, length)}...` : str);

export const fileExist = (file: string) =>
    access(file, constants.F_OK)
        .then(() => true)
        .catch(() => false);

export const isDirectory = async (path: string) => (await lstat(path)).isDirectory();
