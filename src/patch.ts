import { lstat, readdir, readFile } from 'fs/promises';
import path from 'path';
import { config } from './config';
import { minmax } from './util';

export interface Patch {
    id: number;
    name: string;
    float: { [id: string]: number },
    str: { [id: string]: string },
    cc: { [num: string]: { [voice: string]: number } },
}

const patches: { [engine: string]: Patch[] } = {};

export const getPatches = (engine: string) => patches[engine];

export const getPatch = (engine: string, patchId: number) => {
    const _patches = getPatches(engine);
    const id = minmax(patchId, 0, _patches.length - 1);
    return _patches[id];
}

async function loadPatchesForEngine(enginePath: string) {
    const patchesForType: Patch[] = [];
    try {
        const patchnames = await readdir(enginePath);
        for (const patchname of patchnames) {
            if (patchname[0] !== '_' && patchname !== 'tsconfig.json') {
                const patch = JSON.parse((await readFile(`${enginePath}/${patchname}`)).toString());
                patch.id = parseInt(path.parse(patchname).name);
                patchesForType.push(patch);
            }
        }
    } catch (error) {
        console.error(`Error while loading patches for ${enginePath}`, error);
    }
    return patchesForType;
}

export async function loadPatches() {
    try {
        const names = await readdir(config.path.patches);
        for (const name of names) {
            const enginePath = `${config.path.patches}/${name}`;
            const isDirectory = (await lstat(enginePath)).isDirectory();
            if (isDirectory) {
                patches[name] = await loadPatchesForEngine(enginePath);
            }
        }
    } catch (error) {
        console.error(`Error while loading patche engines`, error);
    }
}

export function patchSetString(engine: string, patchId: number, value: string, stringId: number, voice: number) {
}

export function patchSetNumber(engine: string, patchId: number, value: number, numberId: number, voice: number) {
}

export function patchSetCc(engine: string, patchId: number, value: number, ccId: number, voice: number) {
}
