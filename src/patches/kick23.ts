import path from 'path';
import { getWavetable, Kick23, Wavetable } from 'zic_node';
import { getNextWaveTable } from '../helpers/getNextWavetable';
import { Patch } from '../patch';
import { minmax } from '../util';
import { config } from '../config';
import { drawWavetable } from '../draw/drawWavetable';
import { drawField, drawFieldDual } from '../draw/drawField';
import { drawEnvelope } from '../draw/drawEnvelope';
import { rowNext, rowGet, rowReset, rowGetAndAdd } from '../draw/rowNext';
import { drawSeparator } from '../draw/drawSeparator';

const fId = Kick23.FloatId;
const sId = Kick23.StringId;

let wavetable: Wavetable;
let lastWavetable = '';
let lastMorph = 0;

const col = config.screen.col;

const add = config.screen.col === 1 ? 3 : 1;
const rowAddGraph = config.screen.col === 1 ? () => rowGetAndAdd(add) : () => rowGet() + 1;

export default function (patch: Patch, scrollY: number) {
    rowReset();

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
        `Distortion`,
        patch.floats[fId.distortion].toString(),
        patch.floats[fId.distortionRange].toString(),
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.distortion, minmax(patch.floats[fId.distortion] + direction, 0, 100));
            },
            steps: [1, 10],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.distortionRange, minmax(patch.floats[fId.distortionRange] + direction, 10, 120));
            },
            steps: [1, 10],
        },
        { scrollY, col, info2: `range`, info: `%` },
    );

    drawField(
        `Filter`,
        patch.floats[fId.filterCutoff].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.filterCutoff, minmax(patch.floats[fId.filterCutoff] + direction, 200, 8000));
            },
            steps: [10, 100],
        },
        { info: 'hz', scrollY },
    );
    drawField(
        `Resonance`,
        ` ${Math.round(patch.floats[fId.filterResonance] * 100)}`,
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.filterResonance, minmax(patch.floats[fId.filterResonance] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            col,
            info: `%`,
            scrollY,
        },
    );

    drawField(
        `Duration`,
        patch.floats[fId.Duration].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Duration, minmax(patch.floats[fId.Duration] + direction, 10, 5000));
            },
            steps: [1, 10],
        },
        {
            info: `ms (t)`,
            scrollY,
        },
    );

    drawSeparator('Wavetable', rowNext(1), { scrollY });

    if (patch.strings[sId.Wavetable] !== lastWavetable || patch.floats[fId.Morph] !== lastMorph) {
        lastWavetable = patch.strings[sId.Wavetable];
        lastMorph = patch.floats[fId.Morph];
        wavetable = getWavetable(lastWavetable, lastMorph);
    }
    drawWavetable(wavetable.data, { row: rowAddGraph(), col, scrollY });
    drawField(
        `Wavetable`,
        path.parse(patch.strings[sId.Wavetable]).name,
        rowNext(1),
        {
            edit: async (direction) => {
                patch.setString(sId.Wavetable, await getNextWaveTable(direction, patch.strings[sId.Wavetable]));
            },
            steps: [1, 10],
        },
        { scrollY },
    );
    drawField(
        `Morph`,
        `${patch.floats[fId.Morph].toFixed(1)}/${wavetable.wavetableCount}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Morph, minmax(patch.floats[fId.Morph] + direction, 0, 64));
            },
            steps: [0.1, 1],
        },
        { scrollY, info: `${wavetable.wavetableSampleCount} samples` },
    );
    drawField(
        `Frequency`,
        patch.floats[fId.Frequency].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Frequency, minmax(patch.floats[fId.Frequency] + direction, 10, 2000));
            },
            steps: [1, 10],
        },
        { scrollY, info: `hz` },
    );

    drawSeparator('Envelope Amplitude', rowNext(1), { scrollY });

    drawEnvelope(
        [
            [0, 0],
            [1, 0.01], // Force to have a very short ramp up to avoid clicks
            [patch.floats[fId.envAmp1], patch.floats[fId.envAmp1Time]],
            [patch.floats[fId.envAmp2], patch.floats[fId.envAmp2Time]],
            [patch.floats[fId.envAmp3], patch.floats[fId.envAmp3Time]],
            [0.0, 1.0],
        ],
        { row: rowAddGraph(), col, scrollY },
    );
    drawFieldDual(
        `AmpMod1`,
        Math.round(patch.floats[fId.envAmp1] * 100).toString(),
        Math.round(patch.floats[fId.envAmp1Time] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envAmp1, minmax(patch.floats[fId.envAmp1] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envAmp1Time,
                    minmax(patch.floats[fId.envAmp1Time] + direction, 0, patch.floats[fId.envAmp2Time]),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `AmpMod2`,
        Math.round(patch.floats[fId.envAmp2] * 100).toString(),
        Math.round(patch.floats[fId.envAmp2Time] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envAmp2, minmax(patch.floats[fId.envAmp2] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envAmp2Time,
                    minmax(
                        patch.floats[fId.envAmp2Time] + direction,
                        patch.floats[fId.envAmp1Time],
                        patch.floats[fId.envAmp3Time],
                    ),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `AmpMod3`,
        Math.round(patch.floats[fId.envAmp3] * 100).toString(),
        Math.round(patch.floats[fId.envAmp3Time] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envAmp3, minmax(patch.floats[fId.envAmp3] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envAmp3Time,
                    minmax(patch.floats[fId.envAmp3Time] + direction, patch.floats[fId.envAmp2Time], 1),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );

    drawSeparator('Envelope Frequency', rowNext(1), { scrollY });

    drawEnvelope(
        [
            [1.0, 0.0],
            [patch.floats[fId.envFreq1], patch.floats[fId.envFreq1Time]],
            [patch.floats[fId.envFreq2], patch.floats[fId.envFreq2Time]],
            [patch.floats[fId.envFreq3], patch.floats[fId.envFreq3Time]],
            [0.0, 1.0],
        ],
        { row: rowAddGraph(), col, scrollY },
    );
    drawFieldDual(
        `FrqMod1`,
        Math.round(patch.floats[fId.envFreq1] * 100).toString(),
        Math.round(patch.floats[fId.envFreq1Time] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envFreq1, minmax(patch.floats[fId.envFreq1] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envFreq1Time,
                    minmax(patch.floats[fId.envFreq1Time] + direction, 0, patch.floats[fId.envFreq2Time]),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `FrqMod2`,
        Math.round(patch.floats[fId.envFreq2] * 100).toString(),
        Math.round(patch.floats[fId.envFreq2Time] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envFreq2, minmax(patch.floats[fId.envFreq2] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envFreq2Time,
                    minmax(
                        patch.floats[fId.envFreq2Time] + direction,
                        patch.floats[fId.envFreq1Time],
                        patch.floats[fId.envFreq3Time],
                    ),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `FrqMod3`,
        Math.round(patch.floats[fId.envFreq3] * 100).toString(),
        Math.round(patch.floats[fId.envFreq3Time] * 100).toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envFreq3, minmax(patch.floats[fId.envFreq3] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envFreq3Time,
                    minmax(patch.floats[fId.envFreq3Time] + direction, patch.floats[fId.envFreq2Time], 1),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
}
