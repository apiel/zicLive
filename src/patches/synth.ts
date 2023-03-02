import path from 'path';
import { getWavetable, SynthDualOsc, Wavetable, FilterNames, FilterMode } from 'zic_node';
import { getNextWaveTable } from '../helpers/getNextWavetable';
import { Patch } from '../patch';
import { minmax } from '../util';
import { config } from '../config';
import { drawWavetable } from '../draw/drawWavetable';
import { drawField, drawFieldDual } from '../draw/drawField';
import { drawEnvelope } from '../draw/drawEnvelope';
import { rowGetAndAdd, rowGet, rowNext, rowReset } from '../draw/rowNext';
import { drawSeparator } from '../draw/drawSeparator';
import { drawSliderField } from '../draw/drawSlider';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

interface WavetableState {
    wavetable: Wavetable;
    name: string;
    morph: number;
}

const wavetables: WavetableState[] = [];

const col = config.screen.col;

const add = config.screen.col === 1 ? 3 : 1;
const rowAddGraph = config.screen.col === 1 ? () => rowGetAndAdd(add) : () => rowGet() + 1;

// TODO should there be on top a way to change of seq??
export default function (patch: Patch, scrollY: number) {
    rowReset();
    if (
        !wavetables[sId.oscWavetable] ||
        patch.strings[sId.oscWavetable] !== wavetables[sId.oscWavetable].name ||
        patch.floats[fId.OscMorph] !== wavetables[sId.oscWavetable].morph
    ) {
        const name = patch.strings[sId.oscWavetable];
        const morph = patch.floats[fId.OscMorph];
        wavetables[sId.oscWavetable] = {
            name,
            morph,
            wavetable: getWavetable(name, morph),
        };
    }

    if (
        !wavetables[sId.osc2Wavetable] ||
        patch.strings[sId.osc2Wavetable] !== wavetables[sId.osc2Wavetable].name ||
        patch.floats[fId.Osc2Morph] !== wavetables[sId.osc2Wavetable].morph
    ) {
        const name = patch.strings[sId.osc2Wavetable];
        const morph = patch.floats[fId.Osc2Morph];
        wavetables[sId.osc2Wavetable] = {
            name,
            morph,
            wavetable: getWavetable(name, morph),
        };
    }

    drawField(
        `Volume`,
        Math.round(patch.floats[fId.Volume] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        { scrollY, info: `%` },
    );

    drawFieldDual(
        `Filter`,
        patch.floats[fId.filterCutoff].toString(),
        ` ${Math.round(patch.floats[fId.filterResonance] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.filterCutoff, minmax(patch.floats[fId.filterCutoff] + direction, 200, 8000));
            },
            steps: [10, 100],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.filterResonance, minmax(patch.floats[fId.filterResonance] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: 'hz', info2: '% res', scrollY },
    );
    drawField(
        `Shape`,
        `${FilterNames[patch.floats[fId.filterMode]]}`,
        rowNext(col), //rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.filterMode,
                    minmax(patch.floats[fId.filterMode] + direction, 0, FilterMode.COUNT - 1),
                );
            },
        },
        {
            col,
            scrollY,
        },
    );

    drawSeparator('Oscillator 1', rowNext(1), { scrollY });

    let wavetable = wavetables[sId.oscWavetable];
    drawWavetable(wavetable.wavetable.data, { row: rowAddGraph(), col, scrollY });
    drawField(
        `Wavetable`,
        path.parse(wavetable.name).name,
        rowNext(1),
        {
            edit: async (direction) => {
                patch.setString(sId.oscWavetable, await getNextWaveTable(direction, wavetable.name));
            },
            steps: [1, 10],
        },
        { scrollY },
    );
    drawField(
        `Morph`,
        `${patch.floats[fId.OscMorph].toFixed(1)}/${wavetable.wavetable.wavetableCount}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.OscMorph, minmax(patch.floats[fId.OscMorph] + direction, 0, 64));
            },
            steps: [0.1, 1],
        },
        { scrollY, info: `${wavetable.wavetable.wavetableSampleCount} samples` },
    );
    drawField(
        `Amplitude`,
        `${Math.round(patch.floats[fId.OscAmplitude] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.OscAmplitude, minmax(patch.floats[fId.OscAmplitude] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        { scrollY, info: `%` },
    );
    drawField(
        `Frequency`,
        patch.floats[fId.OscFrequency].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.OscFrequency, minmax(patch.floats[fId.OscFrequency] + direction, 10, 2000));
            },
            steps: [1, 10],
        },
        { scrollY, info: `hz` },
    );

    drawSeparator('Oscillator 2 / LFO', rowNext(1), { scrollY });

    drawSliderField(
        `Mix`,
        patch.floats[fId.Mix],
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Mix, minmax(patch.floats[fId.Mix] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        { scrollY, leftLabel: 'osc1', rightLabel: 'osc2' },
    );

    drawField(
        `Freq NoteOn`,
        patch.floats[fId.osc2FreqNoteOn] ? '      On' : '     Off',
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.osc2FreqNoteOn, minmax(patch.floats[fId.osc2FreqNoteOn] + direction, 0, 1));
            },
        },
        { scrollY, col },
    );

    let wavetable2 = wavetables[sId.osc2Wavetable];
    drawWavetable(wavetable2.wavetable.data, { row: rowAddGraph(), col, scrollY });
    drawField(
        `Wavetable`,
        path.parse(wavetable2.name).name,
        rowNext(1),
        {
            edit: async (direction) => {
                patch.setString(sId.osc2Wavetable, await getNextWaveTable(direction, wavetable2.name));
            },
            steps: [1, 10],
        },
        { scrollY },
    );
    drawField(
        `Morph`,
        `${patch.floats[fId.Osc2Morph].toFixed(1)}/${wavetable2.wavetable.wavetableCount}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Osc2Morph, minmax(patch.floats[fId.Osc2Morph] + direction, 0, 64));
            },
            steps: [0.1, 1],
        },
        { scrollY, info: `${wavetable2.wavetable.wavetableSampleCount} samples` },
    );
    drawField(
        `Amplitude`,
        `${Math.round(patch.floats[fId.Osc2Amplitude] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Osc2Amplitude, minmax(patch.floats[fId.Osc2Amplitude] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        { scrollY, info: `%` },
    );
    drawField(
        `Frequency`,
        patch.floats[fId.Osc2Frequency].toFixed(1).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                const val = patch.floats[fId.Osc2Frequency];
                patch.setNumber(
                    fId.Osc2Frequency,
                    minmax(val + direction * (patch.floats[fId.Osc2Frequency] > 10 ? 1 : 0.1), 0.1, 2000),
                );
            },
            steps: [1, 10],
        },
        { scrollY, info: `hz` },
    );

    drawFieldDual(
        `Mod. Osc1`,
        `${Math.round(patch.floats[fId.osc2ModPitch] * 100)}`,
        `${Math.round(patch.floats[fId.osc2ModAmplitude] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.osc2ModPitch, minmax(patch.floats[fId.osc2ModPitch] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.osc2ModAmplitude, minmax(patch.floats[fId.osc2ModAmplitude] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: '%frq', info2: '%amp', scrollY },
    );

    drawFieldDual(
        `Mod. Filter`,
        `${Math.round(patch.floats[fId.osc2ModCutOff] * 100)}`,
        `${Math.round(patch.floats[fId.osc2ModResonance] * 100)}`,
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.osc2ModCutOff, minmax(patch.floats[fId.osc2ModCutOff] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.osc2ModResonance, minmax(patch.floats[fId.osc2ModResonance] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: '%frq', info2: '%res', scrollY, col },
    );

    drawFieldDual(
        ``,
        `${Math.round(patch.floats[fId.osc2ModMorph] * 100)}`,
        ``,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.osc2ModMorph, minmax(patch.floats[fId.osc2ModMorph] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {},
        { info: '%morph', scrollY },
    );

    drawSeparator('Envelope', rowNext(1), { scrollY });

    const envMs = patch.floats[fId.envAttack] + patch.floats[fId.envDecay] + patch.floats[fId.envRelease];
    const env = (envMs / 4) * 5;
    drawEnvelope(
        env
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
              ],
        { row: rowAddGraph(), col, scrollY },
    );

    drawField(
        `Attack`,
        patch.floats[fId.envAttack].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envAttack, minmax(patch.floats[fId.envAttack] + direction, 0, 9900));
            },
            steps: [10, 100],
        },
        {
            scrollY,
            info: `ms`,
        },
    );

    drawField(
        `Decay`,
        patch.floats[fId.envDecay].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envDecay, minmax(patch.floats[fId.envDecay] + direction, 0, 9900));
            },
            steps: [10, 100],
        },
        {
            scrollY,
            info: `ms`,
        },
    );

    drawField(
        `Sustain`,
        Math.round(patch.floats[fId.envSustain] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envSustain, minmax(patch.floats[fId.envSustain] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            scrollY,
            info: `%`,
        },
    );

    drawField(
        `Release`,
        patch.floats[fId.envRelease].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envRelease, minmax(patch.floats[fId.envRelease] + direction, 0, 9900));
            },
            steps: [10, 100],
        },
        {
            scrollY,
            info: `ms`,
        },
    );

    drawFieldDual(
        `Env. Osc.`,
        `${Math.round(patch.floats[fId.envModPitch] * 100)}`,
        `${Math.round(patch.floats[fId.envModAmplitude] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envModPitch, minmax(patch.floats[fId.envModPitch] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.envModAmplitude, minmax(patch.floats[fId.envModAmplitude] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: '%frq', info2: '%amp', scrollY },
    );

    drawFieldDual(
        `Env. Osc2.`,
        `${Math.round(patch.floats[fId.envModPitch2] * 100)}`,
        `${Math.round(patch.floats[fId.envModAmplitude2] * 100)}`,
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.envModPitch2, minmax(patch.floats[fId.envModPitch2] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.envModAmplitude2, minmax(patch.floats[fId.envModAmplitude2] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: '%frq', info2: '%amp', scrollY, col },
    );

    drawFieldDual(
        ``,
        `${Math.round(patch.floats[fId.envModMorph] * 100)}`,
        ``,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envModMorph, minmax(patch.floats[fId.envModMorph] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {},
        { info: '%morph', scrollY },
    );

    drawFieldDual(
        ``,
        `${Math.round(patch.floats[fId.envModMorph2] * 100)}`,
        ``,
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.envModMorph2, minmax(patch.floats[fId.envModMorph2] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {},
        { info: '%morph', scrollY, col },
    );

    drawFieldDual(
        `Env. Filter`,
        `${Math.round(patch.floats[fId.envModCutoff] * 100)}`,
        `${Math.round(patch.floats[fId.envModResonance] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envModCutoff, minmax(patch.floats[fId.envModCutoff] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.envModResonance, minmax(patch.floats[fId.envModResonance] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: '%frq', info2: '%res', scrollY },
    );
}
