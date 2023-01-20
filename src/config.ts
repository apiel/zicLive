const BASE_PATH = '.'
export const DATA_PATH = `${BASE_PATH}/data`

export const config = {
    screen: {
        size: { w: 420, h: 300 },
    },
    path: {
        patterns: `${DATA_PATH}/patterns`,
        patches: `${DATA_PATH}/patches`,
        tracks: `${DATA_PATH}/projects/000/tracks`,
        sequences: `${DATA_PATH}/projects/000/sequences.json`,
    }
};
