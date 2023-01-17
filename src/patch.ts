export interface Patch {
    id: number;
    name: string;
}

export interface Preset {
    id: number;
}

export const patches: Patch[] = [
    { id: 0, name: 'Kick' },
    { id: 1, name: 'Organic' },
    { id: 2, name: 'Melo' },
    { id: 3, name: 'Bass' },
    { id: 4, name: 'Midi ch1' },
    { id: 5, name: 'Midi ch2' },
    { id: 6, name: 'Psy' },
    { id: 7, name: 'Drone' },
];

export const presets = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
];