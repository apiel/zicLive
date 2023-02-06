import path from 'path';
import { getWavetable, ZicSynth, Wavetable, FilterNames, FilterMode } from 'zic_node';
import { getNextWaveTable } from '../helpers/getNextWavetable';
import { loadPatchId, Patch, savePatch, savePatchAs } from '../patch';
import { minmax } from '../util';
import { config } from '../config';
import { drawWavetable } from '../draw/drawWavetable';
import { drawField, drawFieldDual } from '../draw/drawField';
import { drawEnvelope } from '../draw/drawEnvelope';
import { drawKeyboard } from '../draw/drawKeyboard';
import { withInfo, withSuccess } from '../draw/drawMessage';
import { rowGetAndAdd, rowGet, rowNext, rowReset } from '../draw/rowNext';

const fId = ZicSynth.FloatId;
const sId = ZicSynth.StringId;

let saveAs = '';

interface WavetableState {
    wavetable: Wavetable;
    name: string;
    morph: number;
}

const wavetables: WavetableState[] = [];

export function zicSynthInit(patch: Patch) {
    saveAs = patch.name;
}

const col = config.screen.col;

const add = config.screen.col === 1 ? 3 : 1;
const rowAddGraph = config.screen.col === 1 ? () => rowGetAndAdd(add) : () => rowGet();

export default function (patch: Patch, scrollY: number) {
    rowReset();
    if (
        !wavetables[sId.oscWavetable] ||
        patch.strings[sId.oscWavetable] !== wavetables[sId.oscWavetable].name ||
        patch.floats[fId.Morph] !== wavetables[sId.oscWavetable].morph
    ) {
        const name = patch.strings[sId.oscWavetable];
        const morph = patch.floats[fId.Morph];
        wavetables[sId.oscWavetable] = {
            name,
            morph,
            wavetable: getWavetable(name, morph),
        }
    }
    let wavetable = wavetables[sId.oscWavetable];
    drawWavetable(wavetable.wavetable.data, { row: rowAddGraph(), col, scrollY });
    drawField(
        `Wavetable`,
        path.parse(wavetable.name).name,
        rowGetAndAdd(1),
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
        `${patch.floats[fId.Morph].toFixed(1)}/${wavetable.wavetable.wavetableCount}`,
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Morph, minmax(patch.floats[fId.Morph] + direction, 0, 64));
            },
            steps: [0.1, 1],
        },
        { scrollY, info: `${wavetable.wavetable.wavetableSampleCount} samples` },
    );
    drawField(
        `Frequency`,
        patch.floats[fId.OscFrequency].toString(),
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.OscFrequency, minmax(patch.floats[fId.OscFrequency] + direction, 10, 2000));
            },
            steps: [1, 10],
        },
        { scrollY, info: `hz` },
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
        `Type`,
        ` ${FilterNames[patch.floats[fId.filterMode]]}`,
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.filterMode, minmax(patch.floats[fId.filterMode] + direction, 0, FilterMode.COUNT - 1));
            },
        },
        {
            col,
            scrollY,
        },
    );

    // drawField(
    //     `Volume`,
    //     Math.round(patch.floats[fId.Volume] * 100).toString(),
    //     rowNext(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction, 0, 1));
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     { scrollY },
    // );
    // drawField(
    //     `Duration`,
    //     patch.floats[fId.Duration].toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.Duration, minmax(patch.floats[fId.Duration] + direction, 10, 5000));
    //         },
    //         steps: [1, 10],
    //     },
    //     {
    //         col,
    //         info: `ms (t)`,
    //         scrollY,
    //     },
    // );

    // drawEnvelope(
    //     [
    //         [0, 0],
    //         [1, 0.01], // Force to have a very short ramp up to avoid clicks
    //         [patch.floats[fId.envAmp1], patch.floats[fId.envAmp1Time]],
    //         [patch.floats[fId.envAmp2], patch.floats[fId.envAmp2Time]],
    //         [patch.floats[fId.envAmp3], patch.floats[fId.envAmp3Time]],
    //         [0.0, 1.0],
    //     ],
    //     { row: rowAddGraph(), col, scrollY },
    // );
    // drawFieldDual(
    //     `AmpMod1`,
    //     Math.round(patch.floats[fId.envAmp1] * 100).toString(),
    //     Math.round(patch.floats[fId.envAmp1Time] * 100).toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.envAmp1, minmax(patch.floats[fId.envAmp1] + direction, 0, 1));
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(
    //                 fId.envAmp1Time,
    //                 minmax(patch.floats[fId.envAmp1Time] + direction, 0, patch.floats[fId.envAmp2Time]),
    //             );
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     { info: '%', info2: '%t', scrollY },
    // );
    // drawFieldDual(
    //     `AmpMod2`,
    //     Math.round(patch.floats[fId.envAmp2] * 100).toString(),
    //     Math.round(patch.floats[fId.envAmp2Time] * 100).toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.envAmp2, minmax(patch.floats[fId.envAmp2] + direction, 0, 1));
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(
    //                 fId.envAmp2Time,
    //                 minmax(
    //                     patch.floats[fId.envAmp2Time] + direction,
    //                     patch.floats[fId.envAmp1Time],
    //                     patch.floats[fId.envAmp3Time],
    //                 ),
    //             );
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     { info: '%', info2: '%t', scrollY },
    // );
    // drawFieldDual(
    //     `AmpMod3`,
    //     Math.round(patch.floats[fId.envAmp3] * 100).toString(),
    //     Math.round(patch.floats[fId.envAmp3Time] * 100).toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.envAmp3, minmax(patch.floats[fId.envAmp3] + direction, 0, 1));
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(
    //                 fId.envAmp3Time,
    //                 minmax(patch.floats[fId.envAmp3Time] + direction, patch.floats[fId.envAmp2Time], 1),
    //             );
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     { info: '%', info2: '%t', scrollY },
    // );

    // drawEnvelope(
    //     [
    //         [1.0, 0.0],
    //         [patch.floats[fId.envFreq1], patch.floats[fId.envFreq1Time]],
    //         [patch.floats[fId.envFreq2], patch.floats[fId.envFreq2Time]],
    //         [patch.floats[fId.envFreq3], patch.floats[fId.envFreq3Time]],
    //         [0.0, 1.0],
    //     ],
    //     { row: rowAddGraph(), col, scrollY },
    // );
    // drawFieldDual(
    //     `FrqMod1`,
    //     Math.round(patch.floats[fId.envFreq1] * 100).toString(),
    //     Math.round(patch.floats[fId.envFreq1Time] * 100).toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.envFreq1, minmax(patch.floats[fId.envFreq1] + direction, 0, 1));
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(
    //                 fId.envFreq1Time,
    //                 minmax(patch.floats[fId.envFreq1Time] + direction, 0, patch.floats[fId.envFreq2Time]),
    //             );
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     { info: '%', info2: '%t', scrollY },
    // );
    // drawFieldDual(
    //     `FrqMod2`,
    //     Math.round(patch.floats[fId.envFreq2] * 100).toString(),
    //     Math.round(patch.floats[fId.envFreq2Time] * 100).toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.envFreq2, minmax(patch.floats[fId.envFreq2] + direction, 0, 1));
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(
    //                 fId.envFreq2Time,
    //                 minmax(
    //                     patch.floats[fId.envFreq2Time] + direction,
    //                     patch.floats[fId.envFreq1Time],
    //                     patch.floats[fId.envFreq3Time],
    //                 ),
    //             );
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     { info: '%', info2: '%t', scrollY },
    // );
    // drawFieldDual(
    //     `FrqMod3`,
    //     Math.round(patch.floats[fId.envFreq3] * 100).toString(),
    //     Math.round(patch.floats[fId.envFreq3Time] * 100).toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.envFreq3, minmax(patch.floats[fId.envFreq3] + direction, 0, 1));
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(
    //                 fId.envFreq3Time,
    //                 minmax(patch.floats[fId.envFreq3Time] + direction, patch.floats[fId.envFreq2Time], 1),
    //             );
    //         },
    //         steps: [0.01, 0.1],
    //     },
    //     { info: '%', info2: '%t', scrollY },
    // );

    // drawFieldDual(
    //     `Distortion`,
    //     patch.floats[fId.distortion].toString(),
    //     patch.floats[fId.distortionRange].toString(),
    //     rowGetAndAdd(1),
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.distortion, minmax(patch.floats[fId.distortion] + direction, 0, 100));
    //         },
    //         steps: [1, 10],
    //     },
    //     {
    //         edit: (direction) => {
    //             patch.setNumber(fId.distortionRange, minmax(patch.floats[fId.distortionRange] + direction, 10, 120));
    //         },
    //         steps: [1, 10],
    //     },
    //     { scrollY },
    // );

    // drawFieldDual(
    //     ``,
    //     `Reload`,
    //     `Save`,
    //     rowNext(1),
    //     {
    //         edit: withInfo('Loaded', () => loadPatchId('kick23', patch.id)),
    //     },
    //     {
    //         edit: withSuccess('Saved', () => savePatch('kick23', patch.id)),
    //     },
    //     { scrollY },
    // );

    // drawField(
    //     `Save as`,
    //     saveAs,
    //     rowGetAndAdd(1),
    //     {
    //         edit: () => {
    //             savePatchAs('kick23', patch, saveAs);
    //         },
    //     },
    //     {
    //         col,
    //         scrollY,
    //     },
    // );

    // // drawFieldDual(
    // //     ``,
    // //     `Delete`,
    // //     `Rename`, // ?
    // //     row,
    // //     {
    // //         // TODO #4 patch delete. If patch used, they should be replaced with default patch
    // //         edit: () => console.log('Delete to be implemented...'),
    // //     },
    // //     {
    // //         // edit: () => savePatch('kick23', patch.id),
    // //     },
    // //     { scrollY },
    // // );

    // drawKeyboard(
    //     (char) => {
    //         if (char === 'DEL') {
    //             saveAs = saveAs.slice(0, -1);
    //         } else if (char === 'DONE') {
    //             savePatchAs('kick23', patch, saveAs);
    //         } else {
    //             if (saveAs.length < 10) {
    //                 saveAs += char;
    //             }
    //         }
    //     },
    //     { row: rowNext(1), col, scrollY, done: 'SAVE' },
    // );
}
