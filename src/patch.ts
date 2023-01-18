import { lstat, readdir, readFile } from 'fs/promises';
import path from 'path';
import { config } from './config';

export interface Preset {
    id: number;
    name: string;
}

export interface Patch {
    id: number;
    name: string;
    presets: Preset[];
}

const patchTypes: { [name: string]: Patch[] } = {};

const presets = [
    { id: 0, name: 'Kick' },
    { id: 1, name: 'Organic' },
    { id: 2, name: 'Melo' },
    { id: 3, name: 'Bass' },
    { id: 4, name: 'Midi ch1' },
    { id: 5, name: 'Midi ch2' },
    { id: 6, name: 'Psy' },
    { id: 7, name: 'Drone' },
];

export const patches: Patch[] = [
    { id: 0, name: 'Kick', presets },
    { id: 1, name: 'Organic', presets },
    { id: 2, name: 'Melo', presets },
    { id: 3, name: 'Bass', presets },
    { id: 4, name: 'Midi ch1', presets },
    { id: 5, name: 'Midi ch2', presets },
    { id: 6, name: 'Psy', presets },
    { id: 7, name: 'Drone', presets },
];

export const getPreset = (patchId: number, presetId: number) => patches[patchId].presets[presetId];

async function loadPresets(patchPath: string) {
    const presets: Preset[] = [];
    try {
        const presetnames = await readdir(`${patchPath}/presets`);
        for (const presetname of presetnames) {
            const preset = JSON.parse(
                (await readFile(`${patchPath}/presets/${presetname}`)).toString(),
            );
            preset.id = parseInt(path.parse(presetname).name);
            presets.push(preset);
        }
    } catch (error) {
        console.error(`Error while loading preset for ${patchPath}`, error);
    }
    return presets;
}

async function loadPatchesForType(pathTypePath: string) {
    const patches: Patch[] = [];
    try {
        const patchnames = await readdir(pathTypePath);
        for (const patchname of patchnames) {
            const patchPath = `${pathTypePath}/${patchname}`;
            const isDirectory = (await lstat(patchPath)).isDirectory();
            if (isDirectory) {
                const patch = JSON.parse((await readFile(`${patchPath}/patch.json`)).toString());
                patch.id = parseInt(patchname);
                patch.presets = await loadPresets(patchPath);
                patches.push(patch);
            }
        }
    } catch (error) {
        console.error(`Error while loading patches for ${pathTypePath}`, error);
    }
    return patches;
}

export async function loadPatches() {
    try {
        const names = await readdir(config.path.patches);
        for (const name of names) {
            const pathTypePath = `${config.path.patches}/${name}`;
            const isDirectory = (await lstat(pathTypePath)).isDirectory();
            if (isDirectory) {
                patchTypes[name] = await loadPatchesForType(pathTypePath);
            }
        }
    } catch (error) {
        console.error(`Error while loading patches`, error);
    }
}
