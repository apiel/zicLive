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
const drawSlider_1 = require("../draw/drawSlider");
const fId = zic_node_1.SynthDualOsc.FloatId;
const sId = zic_node_1.SynthDualOsc.StringId;
const wavetables = [];
const col = config_1.config.screen.col;
const add = config_1.config.screen.col === 1 ? 3 : 1;
const rowAddGraph = config_1.config.screen.col === 1 ? () => (0, rowNext_1.rowGetAndAdd)(add) : () => (0, rowNext_1.rowGet)() + 1;
// TODO should there be on top a way to change of seq??
function default_1(patch, scrollY) {
    if (!wavetables[sId.oscWavetable] ||
        patch.strings[sId.oscWavetable] !== wavetables[sId.oscWavetable].name ||
        patch.floats[fId.OscMorph] !== wavetables[sId.oscWavetable].morph) {
        const name = patch.strings[sId.oscWavetable];
        const morph = patch.floats[fId.OscMorph];
        wavetables[sId.oscWavetable] = {
            name,
            morph,
            wavetable: (0, zic_node_1.getWavetable)(name, morph),
        };
    }
    if (!wavetables[sId.osc2Wavetable] ||
        patch.strings[sId.osc2Wavetable] !== wavetables[sId.osc2Wavetable].name ||
        patch.floats[fId.Osc2Morph] !== wavetables[sId.osc2Wavetable].morph) {
        const name = patch.strings[sId.osc2Wavetable];
        const morph = patch.floats[fId.Osc2Morph];
        wavetables[sId.osc2Wavetable] = {
            name,
            morph,
            wavetable: (0, zic_node_1.getWavetable)(name, morph),
        };
    }
    (0, drawField_1.drawField)(`Volume`, Math.round(patch.floats[fId.Volume] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Volume, (0, util_1.minmax)(patch.floats[fId.Volume] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, { scrollY, info: `%` });
    (0, drawField_1.drawFieldDual)(`Filter`, patch.floats[fId.filterCutoff].toString(), ` ${Math.round(patch.floats[fId.filterResonance] * 100)}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.filterCutoff, (0, util_1.minmax)(patch.floats[fId.filterCutoff] + direction, 200, 8000));
        },
        steps: [10, 100],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.filterResonance, (0, util_1.minmax)(patch.floats[fId.filterResonance] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, { info: 'hz', info2: '% res', scrollY });
    (0, drawField_1.drawField)(`Shape`, `${zic_node_1.FilterNames[patch.floats[fId.filterMode]]}`, (0, rowNext_1.rowNext)(col), //rowGetAndAdd(1),
    {
        edit: (direction) => {
            patch.setNumber(fId.filterMode, (0, util_1.minmax)(patch.floats[fId.filterMode] + direction, 0, zic_node_1.FilterMode.COUNT - 1));
        },
    }, {
        col,
        scrollY,
    });
    (0, drawSeparator_1.drawSeparator)('Oscillator 1', (0, rowNext_1.rowNext)(1), { scrollY });
    let wavetable = wavetables[sId.oscWavetable];
    (0, drawWavetable_1.drawWavetable)(wavetable.wavetable.data, { row: rowAddGraph(), col, scrollY });
    (0, drawField_1.drawField)(`Wavetable`, path_1.default.parse(wavetable.name).name, (0, rowNext_1.rowNext)(1), {
        edit: async (direction) => {
            patch.setString(sId.oscWavetable, await (0, getNextWavetable_1.getNextWaveTable)(direction, wavetable.name));
        },
        steps: [1, 10],
    }, { scrollY });
    (0, drawField_1.drawField)(`Morph`, `${patch.floats[fId.OscMorph].toFixed(1)}/${wavetable.wavetable.wavetableCount}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.OscMorph, (0, util_1.minmax)(patch.floats[fId.OscMorph] + direction, 0, 64));
        },
        steps: [0.1, 1],
    }, { scrollY, info: `${wavetable.wavetable.wavetableSampleCount} samples` });
    (0, drawField_1.drawField)(`Amplitude`, `${Math.round(patch.floats[fId.OscAmplitude] * 100)}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.OscAmplitude, (0, util_1.minmax)(patch.floats[fId.OscAmplitude] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, { scrollY, info: `%` });
    (0, drawField_1.drawField)(`Frequency`, patch.floats[fId.OscFrequency].toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.OscFrequency, (0, util_1.minmax)(patch.floats[fId.OscFrequency] + direction, 10, 2000));
        },
        steps: [1, 10],
    }, { scrollY, info: `hz` });
    (0, drawSeparator_1.drawSeparator)('Oscillator 2 / LFO', (0, rowNext_1.rowNext)(1), { scrollY });
    (0, drawSlider_1.drawSliderField)(`Mix`, patch.floats[fId.Mix], (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Mix, (0, util_1.minmax)(patch.floats[fId.Mix] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, { scrollY, leftLabel: 'osc1', rightLabel: 'osc2' });
    (0, drawField_1.drawField)(`Freq NoteOn`, patch.floats[fId.osc2FreqNoteOn] ? '      On' : '     Off', (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            patch.setNumber(fId.osc2FreqNoteOn, (0, util_1.minmax)(patch.floats[fId.osc2FreqNoteOn] + direction, 0, 1));
        },
    }, { scrollY, col });
    let wavetable2 = wavetables[sId.osc2Wavetable];
    (0, drawWavetable_1.drawWavetable)(wavetable2.wavetable.data, { row: rowAddGraph(), col, scrollY });
    (0, drawField_1.drawField)(`Wavetable`, path_1.default.parse(wavetable2.name).name, (0, rowNext_1.rowNext)(1), {
        edit: async (direction) => {
            patch.setString(sId.osc2Wavetable, await (0, getNextWavetable_1.getNextWaveTable)(direction, wavetable2.name));
        },
        steps: [1, 10],
    }, { scrollY });
    (0, drawField_1.drawField)(`Morph`, `${patch.floats[fId.Osc2Morph].toFixed(1)}/${wavetable2.wavetable.wavetableCount}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Osc2Morph, (0, util_1.minmax)(patch.floats[fId.Osc2Morph] + direction, 0, 64));
        },
        steps: [0.1, 1],
    }, { scrollY, info: `${wavetable2.wavetable.wavetableSampleCount} samples` });
    (0, drawField_1.drawField)(`Amplitude`, `${Math.round(patch.floats[fId.Osc2Amplitude] * 100)}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.Osc2Amplitude, (0, util_1.minmax)(patch.floats[fId.Osc2Amplitude] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, { scrollY, info: `%` });
    (0, drawField_1.drawField)(`Frequency`, patch.floats[fId.Osc2Frequency].toFixed(1).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            const val = patch.floats[fId.Osc2Frequency];
            patch.setNumber(fId.Osc2Frequency, (0, util_1.minmax)(val + direction * (patch.floats[fId.Osc2Frequency] > 10 ? 1 : 0.1), 0.1, 2000));
        },
        steps: [1, 10],
    }, { scrollY, info: `hz` });
    (0, drawField_1.drawFieldDual)(`Mod. Osc1`, `${Math.round(patch.floats[fId.osc2ModPitch] * 100)}`, `${Math.round(patch.floats[fId.osc2ModAmplitude] * 100)}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.osc2ModPitch, (0, util_1.minmax)(patch.floats[fId.osc2ModPitch] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.osc2ModAmplitude, (0, util_1.minmax)(patch.floats[fId.osc2ModAmplitude] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, { info: '%frq', info2: '%amp', scrollY });
    (0, drawField_1.drawFieldDual)(`Mod. Filter`, `${Math.round(patch.floats[fId.osc2ModCutOff] * 100)}`, `${Math.round(patch.floats[fId.osc2ModResonance] * 100)}`, (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            patch.setNumber(fId.osc2ModCutOff, (0, util_1.minmax)(patch.floats[fId.osc2ModCutOff] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.osc2ModResonance, (0, util_1.minmax)(patch.floats[fId.osc2ModResonance] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, { info: '%frq', info2: '%res', scrollY, col });
    (0, drawField_1.drawFieldDual)(``, `${Math.round(patch.floats[fId.osc2ModMorph] * 100)}`, ``, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.osc2ModMorph, (0, util_1.minmax)(patch.floats[fId.osc2ModMorph] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {}, { info: '%morph', scrollY });
    (0, drawSeparator_1.drawSeparator)('Envelope', (0, rowNext_1.rowNext)(1), { scrollY });
    const envMs = patch.floats[fId.envAttack] + patch.floats[fId.envDecay] + patch.floats[fId.envRelease];
    const env = (envMs / 4) * 5;
    (0, drawEnvelope_1.drawEnvelope)(env
        ? [
            [0, 0],
            [1, patch.floats[fId.envAttack] / env],
            [patch.floats[fId.envSustain], (patch.floats[fId.envAttack] + patch.floats[fId.envDecay]) / env],
            [patch.floats[fId.envSustain], 1.0 - patch.floats[fId.envRelease] / env],
            [0.0, 1.0],
        ]
        : [
            [0, 0],
            [0.0, 1.0],
        ], { row: rowAddGraph(), col, scrollY });
    (0, drawField_1.drawField)(`Attack`, patch.floats[fId.envAttack].toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envAttack, (0, util_1.minmax)(patch.floats[fId.envAttack] + direction, 0, 9900));
        },
        steps: [10, 100],
    }, {
        scrollY,
        info: `ms`,
    });
    (0, drawField_1.drawField)(`Decay`, patch.floats[fId.envDecay].toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envDecay, (0, util_1.minmax)(patch.floats[fId.envDecay] + direction, 0, 9900));
        },
        steps: [10, 100],
    }, {
        scrollY,
        info: `ms`,
    });
    (0, drawField_1.drawField)(`Sustain`, Math.round(patch.floats[fId.envSustain] * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envSustain, (0, util_1.minmax)(patch.floats[fId.envSustain] + direction, 0, 1));
        },
        steps: [0.01, 0.1],
    }, {
        scrollY,
        info: `%`,
    });
    (0, drawField_1.drawField)(`Release`, patch.floats[fId.envRelease].toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envRelease, (0, util_1.minmax)(patch.floats[fId.envRelease] + direction, 0, 9900));
        },
        steps: [10, 100],
    }, {
        scrollY,
        info: `ms`,
    });
    (0, drawField_1.drawFieldDual)(`Env. Osc.`, `${Math.round(patch.floats[fId.envModPitch] * 100)}`, `${Math.round(patch.floats[fId.envModAmplitude] * 100)}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envModPitch, (0, util_1.minmax)(patch.floats[fId.envModPitch] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envModAmplitude, (0, util_1.minmax)(patch.floats[fId.envModAmplitude] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, { info: '%frq', info2: '%amp', scrollY });
    (0, drawField_1.drawFieldDual)(`Env. Osc2.`, `${Math.round(patch.floats[fId.envModPitch2] * 100)}`, `${Math.round(patch.floats[fId.envModAmplitude2] * 100)}`, (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            patch.setNumber(fId.envModPitch2, (0, util_1.minmax)(patch.floats[fId.envModPitch2] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envModAmplitude2, (0, util_1.minmax)(patch.floats[fId.envModAmplitude2] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, { info: '%frq', info2: '%amp', scrollY, col });
    (0, drawField_1.drawFieldDual)(``, `${Math.round(patch.floats[fId.envModMorph] * 100)}`, ``, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envModMorph, (0, util_1.minmax)(patch.floats[fId.envModMorph] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {}, { info: '%morph', scrollY });
    (0, drawField_1.drawFieldDual)(``, `${Math.round(patch.floats[fId.envModMorph2] * 100)}`, ``, (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            patch.setNumber(fId.envModMorph2, (0, util_1.minmax)(patch.floats[fId.envModMorph2] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {}, { info: '%morph', scrollY, col });
    (0, drawField_1.drawFieldDual)(`Env. Filter`, `${Math.round(patch.floats[fId.envModCutoff] * 100)}`, `${Math.round(patch.floats[fId.envModResonance] * 100)}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            patch.setNumber(fId.envModCutoff, (0, util_1.minmax)(patch.floats[fId.envModCutoff] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, {
        edit: (direction) => {
            patch.setNumber(fId.envModResonance, (0, util_1.minmax)(patch.floats[fId.envModResonance] + direction, 0, 1));
        },
        steps: [0.01, 0.05],
    }, { info: '%frq', info2: '%res', scrollY });
}
exports.default = default_1;
