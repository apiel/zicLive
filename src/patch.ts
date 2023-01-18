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

const patches: { [name: string]: Patch[] } = {};

export const getPatches = (type: string) => patches[type];

export const getPatch = (type: string, patchId: number) => patches[type][patchId];

export const getPreset = (type: string, patchId: number, presetId: number) =>
    patches[type][patchId].presets[presetId];

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
    const patchesForType: Patch[] = [];
    try {
        const patchnames = await readdir(pathTypePath);
        for (const patchname of patchnames) {
            const patchPath = `${pathTypePath}/${patchname}`;
            const isDirectory = (await lstat(patchPath)).isDirectory();
            if (isDirectory) {
                const patch = JSON.parse((await readFile(`${patchPath}/patch.json`)).toString());
                patch.id = parseInt(patchname);
                patch.presets = await loadPresets(patchPath);
                patchesForType.push(patch);
            }
        }
    } catch (error) {
        console.error(`Error while loading patches for ${pathTypePath}`, error);
    }
    return patchesForType;
}

export async function loadPatches() {
    try {
        const names = await readdir(config.path.patches);
        for (const name of names) {
            const pathTypePath = `${config.path.patches}/${name}`;
            const isDirectory = (await lstat(pathTypePath)).isDirectory();
            if (isDirectory) {
                patches[name] = await loadPatchesForType(pathTypePath);
            }
        }
    } catch (error) {
        console.error(`Error while loading patches`, error);
    }
}
