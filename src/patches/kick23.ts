import path from 'path';
import { getWavetable, Kick23, Wavetable } from 'zic_node';
import { drawEnvelope, drawField, drawFieldDual, drawKeyboard, drawWavetable } from '../draw';
import { getNextWaveTable } from '../helpers/getNextWavetable';
import { loadPatchId, Patch, savePatch } from '../patch';
import { minmax } from '../util';

const fId = Kick23.FloatId;
const sId = Kick23.StringId;

let wavetable: Wavetable;
let lastWavetable = '';
let lastMorph = 0;

export default function (patch: Patch, scrollY: number) {
    let row = 0;
    if (patch.strings[sId.Wavetable] !== lastWavetable || patch.floats[fId.Morph] !== lastMorph) {
        lastWavetable = patch.strings[sId.Wavetable];
        lastMorph = patch.floats[fId.Morph];
        wavetable = getWavetable(lastWavetable, lastMorph);
    }
    drawWavetable(wavetable.data, { row, col: 2, scrollY });
    drawField(
        `Wavetable`,
        path.parse(patch.strings[sId.Wavetable]).name,
        row++,
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
        row++,
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
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.Frequency, minmax(patch.floats[fId.Frequency] + direction, 10, 2000));
            },
            steps: [1, 10],
        },
        { scrollY },
    );

    drawField(
        `Volume`,
        Math.round(patch.floats[fId.Volume] * 100).toString(),
        row,
        {
            edit: (direction) => {
                patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        { scrollY },
    );
    drawField(
        `Duration`,
        patch.floats[fId.Duration].toString(),
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.Duration, minmax(patch.floats[fId.Duration] + direction, 10, 5000));
            },
            steps: [1, 10],
        },
        {
            col: 2,
            info: `ms (t)`,
            scrollY,
        },
    );

    drawField(
        `Filter`,
        patch.floats[fId.filterCutoff].toString(),
        row,
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
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.filterResonance, minmax(patch.floats[fId.filterResonance] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            col: 2,
            info: `%`,
            scrollY,
        },
    );

    drawEnvelope(
        [
            [0, 0],
            [1, 0.01], // Force to have a very short ramp up to avoid clicks
            [patch.floats[fId.envAmp1], patch.floats[fId.envAmp1Time]],
            [patch.floats[fId.envAmp2], patch.floats[fId.envAmp2Time]],
            [patch.floats[fId.envAmp3], patch.floats[fId.envAmp3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2, scrollY },
    );
    drawFieldDual(
        `AmpMod1`,
        Math.round(patch.floats[fId.envAmp1] * 100).toString(),
        Math.round(patch.floats[fId.envAmp1Time] * 100).toString(),
        row++,
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
        row++,
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
        row++,
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

    drawEnvelope(
        [
            [1.0, 0.0],
            [patch.floats[fId.envFreq1], patch.floats[fId.envFreq1Time]],
            [patch.floats[fId.envFreq2], patch.floats[fId.envFreq2Time]],
            [patch.floats[fId.envFreq3], patch.floats[fId.envFreq3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2, scrollY },
    );
    drawFieldDual(
        `FrqMod1`,
        Math.round(patch.floats[fId.envFreq1] * 100).toString(),
        Math.round(patch.floats[fId.envFreq1Time] * 100).toString(),
        row++,
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
        row++,
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
        row++,
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

    drawFieldDual(
        `Distortion`,
        patch.floats[fId.distortion].toString(),
        patch.floats[fId.distortionRange].toString(),
        row++,
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
        { scrollY },
    );

    drawFieldDual(
        ``,
        `Reload`,
        `Save`,
        row,
        {
            edit: () => loadPatchId('kick23', patch.id),
        },
        {
            edit: () => savePatch('kick23', patch.id),
        },
        { scrollY },
    );

    // TODO implement input field
    drawField(
        `Save as`,
        `Kick23`,
        row++,
        {
            edit: () => {
                console.log('Show alphabetic editor');
            },
        },
        {
            col: 2,
            scrollY,
        },
    );

    drawKeyboard({ row, col: 2, scrollY });
}
