const BASE_PATH = '.';
export const DATA_PATH = `${BASE_PATH}/data`;

const screen = {
    size: { w: 420, h: 300 },
    col: 2 as 1 | 2,
    // size: { w: 240, h: 240 },
    // col: 1 as 1 | 2,
};

const path = {
    patches: `${DATA_PATH}/patches`,
    tracks: `${DATA_PATH}/projects/000/tracks.json`,
    sequences: `${DATA_PATH}/projects/000/sequences`,
    wavetables: `${DATA_PATH}/wavetables`,
};

export const config = {
    screen,
    path,
    sequence: {
        col: screen.col === 1 ? 3 : 5,
    },
    engines: {
        synth: {
            path: `${path.patches}/synth`,
            idStart: 0,
        },
        kick23: {
            path: `${path.patches}/kick23`,
            idStart: 800,
        },
        midi: {
            path: `${path.patches}/midi`,
            idStart: 900,
        },
    },
};

export type EngineType = keyof typeof config.engines;
export type Engine = typeof config.engines[EngineType];
