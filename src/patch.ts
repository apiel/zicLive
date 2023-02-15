import { lstat, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { trackCc, trackSetNumber, trackSetString } from 'zic_node';
import { config } from './config';
import { getPlayingSequencesForPatch, getSequencesForPatchId } from './sequence';
import { minmax } from './util';

export interface Patch {
    id: number;
    name: string;
    floats: { [id: number]: number };
    strings: { [id: number]: string };
    cc: { [id: number]: number };
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

const setString = (patch: Patch) => (stringId: number, value: string) => {
    patch.strings[stringId] = value;

    const sequences = getPlayingSequencesForPatch(patch.id);
    for(const sequence of sequences) {
        trackSetString(sequence.trackId, value, stringId);
    }
}
const setNumber = (patch: Patch) => (floatId: number, value: number) => {
    patch.floats[floatId] = value;

    const sequences = getPlayingSequencesForPatch(patch.id);
    for(const sequence of sequences) {
        trackSetNumber(sequence.trackId, value, floatId);
    }
}
const setCc = (patch: Patch) => (ccId: number, value: number) => {
    patch.cc[ccId] = value;

    const sequences = getPlayingSequencesForPatch(patch.id);
    for(const sequence of sequences) {
        trackCc(sequence.trackId, value, ccId);
    }
}

async function loadPatchForEngine(enginePath: string, patchname: string) {
    const patch = JSON.parse((await readFile(`${enginePath}/${patchname}`)).toString());
    patch.id = parseInt(path.parse(patchname).name);
    patch.setString = setString(patch);
    patch.setNumber = setNumber(patch);
    patch.setCc = setCc(patch);
    return patch;
}

async function loadPatchesForEngine(enginePath: string) {
    const patchesForType: Patch[] = [];
    try {
        const patchnames = await readdir(enginePath);
        for (const patchname of patchnames) {
            if (patchname[0] !== '_' && patchname !== 'tsconfig.json') {
                const patch = await loadPatchForEngine(enginePath, patchname);
                patchesForType.push(patch);
            }
        }
    } catch (error) {
        console.error(`Error while loading patches for ${enginePath}`, error);
    }
    return patchesForType;
}

export async function loadPatchId(engine: string, patchId: number) {
    const enginePath = `${config.path.patches}/${engine}`;
    const patchname = `${patchId.toString().padStart(3, '0')}.json`;
    const patch = await loadPatchForEngine(enginePath, patchname);
    patches[engine][patchId] = patch;
    const sequences = getPlayingSequencesForPatch(patch.id);
    for(const sequence of sequences) {
        for(const id in patch.floats) {
            trackSetNumber(sequence.trackId, patch.floats[id], Number(id));
        }
        for(const id in patch.strings) {
            trackSetString(sequence.trackId, patch.strings[id], Number(id));
        }
        for(const id in patch.cc) {
            trackCc(sequence.trackId, patch.cc[id], Number(id));
        }
    }
}

export function savePatch(engine: string, patchId: number) {
    const enginePath = `${config.path.patches}/${engine}`;
    const patchname = `${patchId.toString().padStart(3, '0')}.json`;
    const patch = patches[engine][patchId];
    return writeFile(`${enginePath}/${patchname}`, JSON.stringify(patch, null, 2))
}

export async function savePatchAs(engine: string, patch: Patch, as: string) {
    const currentId = patch.id;
    const isUnique = patches[engine].every(p => p.name !== as);
    if (!isUnique) {
        throw new Error(`Patch name ${as} is not unique`);
    }
    let nextId = patches[engine].findIndex(p => p.name === '');
    if (nextId === -1) {
        nextId = patches[engine].length;
    }
    patch.name = as;
    patch.id = nextId;
    patches[engine][nextId] = patch;
    await savePatch(engine, nextId);
    const sequences = getSequencesForPatchId(currentId);
    for(const sequence of sequences) {
        sequence.patchId = nextId;
    }
    // Reload patch
    await loadPatchId(engine, currentId);
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
