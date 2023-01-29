const BASE_PATH = '.';
export const DATA_PATH = `${BASE_PATH}/data`;

export const config = {
    screen: {
        // size: { w: 420, h: 300 },
        // col: 2 as (1 | 2),
        size: { w: 240, h: 240 },
        col: 1 as (1 | 2),
    },
    path: {
        patterns: `${DATA_PATH}/patterns`,
        patches: `${DATA_PATH}/patches`,
        tracks: `${DATA_PATH}/projects/000/tracks.json`,
        sequences: `${DATA_PATH}/projects/000/sequences.json`,
        wavetables: `${DATA_PATH}/wavetables`,
    },
};
