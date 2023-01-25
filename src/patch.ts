import { lstat, readdir, readFile } from 'fs/promises';
import path from 'path';
import { trackSetNumber, trackSetString } from 'zic_node';
import { config } from './config';
import { getPlayingSequencesForPatch } from './sequence';
import { minmax } from './util';

export interface Patch {
    id: number;
    name: string;
    number: { [id: string]: number };
    str: { [id: string]: string };
    cc: { [num: string]: { [voice: string]: number } };
    setString: (stringId: number, value: string) => void;
    setNumber: (floatId: number, value: number) => void;
    setCc: (ccId: number, value: number, voice: number) => void;
}

const patches: { [engine: string]: Patch[] } = {};

export const getPatches = (engine: string) => patches[engine];

export const getPatch = (engine: string, patchId: number) => {
    const _patches = getPatches(engine);
    const id = minmax(patchId, 0, _patches.length - 1);
    return _patches[id];
};

const setString = (patch: Patch) => (stringId: number, value: string) => (patch.str[stringId] = value);
const setNumber = (patch: Patch) => (floatId: number, value: number) => {
    patch.number[floatId] = value;

    const sequences = getPlayingSequencesForPatch(patch.id);
    for(const sequence of sequences) {
        trackSetNumber(sequence.trackId, value, floatId);
    }
}
const setCc = (patch: Patch) => (ccId: number, value: number, voice: number) => (patch.cc[ccId][voice] = value);

async function loadPatchesForEngine(enginePath: string) {
    const patchesForType: Patch[] = [];
    try {
        const patchnames = await readdir(enginePath);
        for (const patchname of patchnames) {
            if (patchname[0] !== '_' && patchname !== 'tsconfig.json') {
                const patch = JSON.parse((await readFile(`${enginePath}/${patchname}`)).toString());
                patch.id = parseInt(path.parse(patchname).name);
                patch.setString = setString(patch);
                patch.setNumber = setNumber(patch);
                patch.setCc = setCc(patch);
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
