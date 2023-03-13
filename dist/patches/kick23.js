"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const zic_node_1 = require("zic_node");
const getNextWavetable_1 = require("../helpers/getNextWavetable");
const util_1 = require("../util");
const config_1 = require("../config");
const drawWavetable_1 = require("../draw/drawWavetable");
const drawField_1 = require("../draw/drawField");
const drawEnvelope_1 = require("../draw/drawEnvelope");
const rowNext_1 = require("../draw/rowNext");
const drawSeparator_1 = require("../draw/drawSeparator");
const fId = zic_node_1.Kick23.FloatId;
const sId = zic_node_1.Kick23.StringId;
let wavetable;
let lastWavetable = '';
let lastMorph = 0;
const col = config_1.config.screen.col;
const add = config_1.config.screen.col === 1 ? 3 : 1;
const rowAddGraph = config_1.config.screen.col === 1 ? () => (0, rowNext_1.rowGetAndAdd)(add) : () => (0, rowNext_1.rowGet)() + 1;
function default_1(patch, scrollY) {
    (0, drawField_1.drawField)(`Volume`, Math.round(patch.floats[fId.Volume] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Volume, (0, util_1.minmax)(patch.floats[fId.Volume] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, { scrollY, info: `%` });
    (0, drawField_1.drawFieldDual)(`Distortion`, patch.floats[fId.distortion].toString(), patch.floats[fId.distortionRange].toString(), (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            patch.setNumber(fId.distortion, (0, util_1.minmax)(patch.floats[fId.distortion] + direction, 0, 100));
        },
        steps: [1, 10],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.distortionRange, (0, util_1.minmax)(patch.floats[fId.distortionRange] + direction, 10, 120));
        },
        steps: [1, 10],
    }, { scrollY, col, info2: `range`, info: `%` });
    (0, drawField_1.drawField)(`Filter`, patch.floats[fId.filterCutoff].toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.filterCutoff, (0, util_1.minmax)(patch.floats[fId.filterCutoff] + direction, 200, 8000));
        },
        steps: [10, 100],
    }, { info: 'hz', scrollY });
    (0, drawField_1.drawField)(`Resonance`, ` ${Math.round(patch.floats[fId.filterResonance] * 100)}`, (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            patch.setNumber(fId.filterResonance, (0, util_1.minmax)(patch.floats[fId.filterResonance] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {
        col,
        info: `%`,
        scrollY,
    });
    (0, drawField_1.drawField)(`Duration`, patch.floats[fId.Duration].toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Duration, (0, util_1.minmax)(patch.floats[fId.Duration] + direction, 10, 5000));
        },
        steps: [1, 10],
    }, {
        info: `ms (t)`,
        scrollY,
    });
    (0, drawSeparator_1.drawSeparator)('Wavetable', (0, rowNext_1.rowNext)(1), { scrollY });
    if (patch.strings[sId.Wavetable] !== lastWavetable || patch.floats[fId.Morph] !== lastMorph) {
        lastWavetable = patch.strings[sId.Wavetable];
        lastMorph = patch.floats[fId.Morph];
        wavetable = (0, zic_node_1.getWavetable)(lastWavetable, lastMorph);
    }
    (0, drawWavetable_1.drawWavetable)(wavetable.data, { row: rowAddGraph(), col, scrollY });
    (0, drawField_1.drawField)(`Wavetable`, path_1.default.parse(patch.strings[sId.Wavetable]).name, (0, rowNext_1.rowNext)(1), {
        edit: async (direction) => {
            patch.setString(sId.Wavetable, await (0, getNextWavetable_1.getNextWaveTable)(direction, patch.strings[sId.Wavetable]));
        },
        steps: [1, 10],
    }, { scrollY });
    (0, drawField_1.drawField)(`Morph`, `${patch.floats[fId.Morph].toFixed(1)}/${wavetable.wavetableCount}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Morph, (0, util_1.minmax)(patch.floats[fId.Morph] + direction, 0, 64));
        },
        steps: [0.1, 1],
    }, { scrollY, info: `${wavetable.wavetableSampleCount} samples` });
    (0, drawField_1.drawField)(`Frequency`, patch.floats[fId.Frequency].toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Frequency, (0, util_1.minmax)(patch.floats[fId.Frequency] + direction, 10, 2000));
        },
        steps: [1, 10],
    }, { scrollY, info: `hz` });
    (0, drawSeparator_1.drawSeparator)('Envelope Amplitude', (0, rowNext_1.rowNext)(1), { scrollY });
    (0, drawEnvelope_1.drawEnvelope)([
        [0, 0],
        [1, 0.01],
        [patch.floats[fId.envAmp1], patch.floats[fId.envAmp1Time]],
        [patch.floats[fId.envAmp2], patch.floats[fId.envAmp2Time]],
        [patch.floats[fId.envAmp3], patch.floats[fId.envAmp3Time]],
        [0.0, 1.0],
    ], { row: rowAddGraph(), col, scrollY });
    (0, drawField_1.drawFieldDual)(`AmpMod1`, Math.round(patch.floats[fId.envAmp1] * 100).toString(), Math.round(patch.floats[fId.envAmp1Time] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envAmp1, (0, util_1.minmax)(patch.floats[fId.envAmp1] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envAmp1Time, (0, util_1.minmax)(patch.floats[fId.envAmp1Time] + direction, 0, patch.floats[fId.envAmp2Time]));
        },
        steps: [0.01, 0.1],
    }, { info: '%', info2: '%t', scrollY });
    (0, drawField_1.drawFieldDual)(`AmpMod2`, Math.round(patch.floats[fId.envAmp2] * 100).toString(), Math.round(patch.floats[fId.envAmp2Time] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envAmp2, (0, util_1.minmax)(patch.floats[fId.envAmp2] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envAmp2Time, (0, util_1.minmax)(patch.floats[fId.envAmp2Time] + direction, patch.floats[fId.envAmp1Time], patch.floats[fId.envAmp3Time]));
        },
        steps: [0.01, 0.1],
    }, { info: '%', info2: '%t', scrollY });
    (0, drawField_1.drawFieldDual)(`AmpMod3`, Math.round(patch.floats[fId.envAmp3] * 100).toString(), Math.round(patch.floats[fId.envAmp3Time] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envAmp3, (0, util_1.minmax)(patch.floats[fId.envAmp3] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envAmp3Time, (0, util_1.minmax)(patch.floats[fId.envAmp3Time] + direction, patch.floats[fId.envAmp2Time], 1));
        },
        steps: [0.01, 0.1],
    }, { info: '%', info2: '%t', scrollY });
    (0, drawSeparator_1.drawSeparator)('Envelope Frequency', (0, rowNext_1.rowNext)(1), { scrollY });
    (0, drawEnvelope_1.drawEnvelope)([
        [1.0, 0.0],
        [patch.floats[fId.envFreq1], patch.floats[fId.envFreq1Time]],
        [patch.floats[fId.envFreq2], patch.floats[fId.envFreq2Time]],
        [patch.floats[fId.envFreq3], patch.floats[fId.envFreq3Time]],
        [0.0, 1.0],
    ], { row: rowAddGraph(), col, scrollY });
    (0, drawField_1.drawFieldDual)(`FrqMod1`, Math.round(patch.floats[fId.envFreq1] * 100).toString(), Math.round(patch.floats[fId.envFreq1Time] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envFreq1, (0, util_1.minmax)(patch.floats[fId.envFreq1] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envFreq1Time, (0, util_1.minmax)(patch.floats[fId.envFreq1Time] + direction, 0, patch.floats[fId.envFreq2Time]));
        },
        steps: [0.01, 0.1],
    }, { info: '%', info2: '%t', scrollY });
    (0, drawField_1.drawFieldDual)(`FrqMod2`, Math.round(patch.floats[fId.envFreq2] * 100).toString(), Math.round(patch.floats[fId.envFreq2Time] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envFreq2, (0, util_1.minmax)(patch.floats[fId.envFreq2] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envFreq2Time, (0, util_1.minmax)(patch.floats[fId.envFreq2Time] + direction, patch.floats[fId.envFreq1Time], patch.floats[fId.envFreq3Time]));
        },
        steps: [0.01, 0.1],
    }, { info: '%', info2: '%t', scrollY });
    (0, drawField_1.drawFieldDual)(`FrqMod3`, Math.round(patch.floats[fId.envFreq3] * 100).toString(), Math.round(patch.floats[fId.envFreq3Time] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envFreq3, (0, util_1.minmax)(patch.floats[fId.envFreq3] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envFreq3Time, (0, util_1.minmax)(patch.floats[fId.envFreq3Time] + direction, patch.floats[fId.envFreq2Time], 1));
        },
        steps: [0.01, 0.1],
    }, { info: '%', info2: '%t', scrollY });
}
exports.default = default_1;
