import { readFile, writeFile } from 'fs/promises';
import { setPatch, trackCc, trackSetNumber, trackSetString, PATCH_COUNT } from 'zic_node';
import { config, Engine } from './config';
import { getPlayingSequencesForPatch } from './sequence';
import { fileExist, minmax } from './util';

export let currentPatchId = 0;
export function setCurrentPatchId(id: number) {
    currentPatchId = minmax(0, PATCH_COUNT - 1, id);
}

const sortedEngine = Object.values(config.engines)
    .sort((a, b) => a.idStart - b.idStart)
    .reverse();

function getEngineByPatchId(patchId: number): Engine {
    const engine = sortedEngine.find((engine) => patchId >= engine.idStart);
    if (!engine) {
        throw new Error(`No engine found for patch ${patchId}`);
    }
    return engine;
}

export class Patch {
    protected filename: string;

    isModified: boolean = false;
    engine: Engine;
    name: string = 'Init patch';
    floats: { [id: number]: number } = {};
    strings: { [id: number]: string } = {};
    cc: { [id: number]: number } = {};

    setString(stringId: number, value: string) {
        this.isModified = true;
        this.strings[stringId] = value;

        const sequences = getPlayingSequencesForPatch(this.id);
        for (const {trackId} of sequences) {
            trackId !== undefined && trackSetString(trackId, value, stringId);
        }
    }

    setNumber(floatId: number, value: number) {
        this.isModified = true;
        this.floats[floatId] = value;

        const sequences = getPlayingSequencesForPatch(this.id);
        for (const {trackId} of sequences) {
            trackId !== undefined && trackSetNumber(trackId, value, floatId);
        }
    }

    setCc(ccId: number, value: number) {
        this.isModified = true;
        this.cc[ccId] = value;

        const sequences = getPlayingSequencesForPatch(this.id);
        for (const {trackId} of sequences) {
            trackId !== undefined && trackCc(trackId, value, ccId);
        }
    }

    constructor(public readonly id: number) {
        this.engine = getEngineByPatchId(this.id);
        this.filename = `${(this.id - this.engine.idStart).toString().padStart(3, '0')}.json`;
    }

    save() {
        const engine = getEngineByPatchId(this.id);
        const patchFile = `${engine.path}/${this.filename}`;
        return writeFile(patchFile, JSON.stringify(this, null, 2));
    }

    async load() {
        const patchFile = `${this.engine.path}/${this.filename}`;
        if (!(await fileExist(patchFile))) {
            this.isModified = false;
            this.name = this.engine.initName;
            // TODO might want to assign default patch
            return;
        }
        const patch = JSON.parse((await readFile(patchFile)).toString());
        patch.id += this.engine.idStart;
        this.isModified = true;
        Object.assign(this, patch);
        setPatch(patch);
    }

    set({ id, ...patch}: Partial<Patch>) {
        Object.assign(this, patch);
        setPatch(this);
        this.isModified = true;
    }

    // Should not be necessary because next step it will anyway apply the reloaded patch
    // async reload() {
    //     await this.load();
    //     const sequences = getPlayingSequencesForPatch(this.id);
    //     for (const sequence of sequences) {
    //         for (const id in this.floats) {
    //             trackSetNumber(sequence.trackId, this.floats[id], Number(id));
    //         }
    //         for (const id in this.strings) {
    //             trackSetString(sequence.trackId, this.strings[id], Number(id));
    //         }
    //         for (const id in this.cc) {
    //             trackCc(sequence.trackId, this.cc[id], Number(id));
    //         }
    //     }
    // }
}

export const patches: Patch[] = Array(PATCH_COUNT)
    .fill(undefined)
    .map((_, id) => new Patch(id));

export const getPatch = (patchId: number) => {
    const id = minmax(patchId, 0, patches.length - 1);
    return patches[id];
};

export async function loadPatches() {
    try {
        for (const patch of patches) {
            await patch.load();
        }
    } catch (error) {
        console.error(`Error while loading patche engines`, error);
    }
}

export async function savePatchAs(patch: Patch, as: string) {
    const isUnique = patches.every((p) => p.name !== as);
    if (!isUnique) {
        throw new Error(`Patch name ${as} is not unique`);
    }
    let nextId = patches.findIndex((p) => p.isModified === false);
    if (nextId === -1) {
        throw new Error(`No more free patch`);
    }
    patches[nextId].set({ ...patch, name: as });
    await patches[nextId].save();
}
