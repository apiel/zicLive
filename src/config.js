"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.DATA_PATH = void 0;
const BASE_PATH = '.';
exports.DATA_PATH = `${BASE_PATH}/data`;
exports.config = {
    screen: {
        size: { w: 420, h: 300 },
    },
    path: {
        patterns: `${exports.DATA_PATH}/patterns`,
        patches: `${exports.DATA_PATH}/patches`,
        tracks: `${exports.DATA_PATH}/projects/000/tracks.json`,
        sequences: `${exports.DATA_PATH}/projects/000/sequences.json`,
    }
};
