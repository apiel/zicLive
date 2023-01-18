export interface Preset {
    id: number;
    name: string;
}

export interface Patch {
    id: number;
    name: string;
    presets: Preset[];
}

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
