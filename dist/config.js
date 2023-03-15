"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.DATA_PATH = void 0;
const BASE_PATH = '.';
exports.DATA_PATH = `${BASE_PATH}/data`;
const screen = {
    size: { w: 480, h: 280 },
    col: 2,
    // size: { w: 240, h: 240 },
    // col: 1 as 1 | 2,
};
const path = {
    patches: `${exports.DATA_PATH}/patches`,
    tracks: `${exports.DATA_PATH}/projects/000/tracks.json`,
    sequences: `${exports.DATA_PATH}/projects/000/sequences`,
    wavetables: `${exports.DATA_PATH}/wavetables`,
};
exports.config = {
    screen,
    path,
    sequence: {
        col: 6,
        row: 5,
    },
    engines: {
        synth: {
            path: `${path.patches}/synth`,
            idStart: 0,
            idEnd: 799,
            initName: 'Init Synth',
            name: 'synth',
        },
        kick23: {
            path: `${path.patches}/kick23`,
            idStart: 800,
            idEnd: 899,
            initName: 'Init Kick23',
            name: 'kick23',
        },
        midi: {
            path: `${path.patches}/midi`,
            idStart: 900,
            idEnd: 999,
            initName: 'Init Midi',
            name: 'midi',
        },
    },
};
