import path from 'path';
import { getWavetable, Kick23 } from 'zic_node';
import { drawEnvelope, drawField, drawFieldDual, drawWavetable } from '../draw';
import { Patch } from '../patch';
import { minmax } from '../util';

const fId = Kick23.FloatId;
const sId = Kick23.StringId;

export default function (patch: Patch, scrollY: number) {
    let row = 0;
    drawWavetable(getWavetable(patch.str[sId.Wavetable], patch.number[fId.Morph]), { row, col: 2, scrollY });
    drawField(
        `Wavetable`,
        path.parse(patch.str[sId.Wavetable]).name,
        row++,
        {
            edit: (direction) => {
                // const volume = minmax(getMasterVolume() + direction, 0, 1);
                // setMasterVolume(volume);
            },
            steps: [0.01, 0.1],
        },
        { scrollY },
    );
    drawField(
        `Morph`,
        `${patch.number[fId.Morph]}/64`, // TODO get wavetable count from zic_node
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.Morph, minmax(patch.number[fId.Morph] + direction, 0, 64));
            },
        },
        { scrollY },
    );
    drawField(
        `Frequency`,
        `400`,
        row++,
        {
            edit: (direction) => {
                // const volume = minmax(getMasterVolume() + direction, 0, 1);
                // setMasterVolume(volume);
            },
            steps: [0.01, 0.1],
        },
        { scrollY },
    );

    drawField(
        `Volume`,
        patch.number[fId.Volume].toString(),
        row,
        {
            edit: (direction) => {
                // const volume = minmax(getMasterVolume() + direction, 0, 1);
                // setMasterVolume(volume);
            },
            steps: [0.01, 0.1],
        },
        { scrollY },
    );
    drawField(
        `Duration`,
        patch.number[fId.Duration].toString(),
        row++,
        {
            edit: (direction) => {
                // setBpm(minmax(getBpm() + direction, 10, 250));
            },
        },
        {
            col: 2,
            info: `ms (t)`,
            scrollY,
        },
    );

    drawField(
        `Filter`,
        patch.number[fId.filterCutoff].toString(),
        row,
        {
            edit: (direction) => {
                patch.setNumber(fId.filterCutoff, minmax(patch.number[fId.filterCutoff] + direction, 200, 8000));
            },
            steps: [10, 100],
        },
        { info: 'hz', scrollY },
    );
    drawField(
        `Resonance`,
        ` ${Math.round(patch.number[fId.filterResonance]* 100)}`,
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.filterResonance, minmax(patch.number[fId.filterResonance] + direction, 0, 1));
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
            [patch.number[fId.envAmp1], patch.number[fId.envAmp1Time]],
            [patch.number[fId.envAmp2], patch.number[fId.envAmp2Time]],
            [patch.number[fId.envAmp3], patch.number[fId.envAmp3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2, scrollY },
    );
    drawFieldDual(
        `AmpMod1`,
        Math.round(patch.number[fId.envAmp1] * 100).toString(),
        Math.round(patch.number[fId.envAmp1Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.envAmp1, minmax(patch.number[fId.envAmp1] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envAmp1Time,
                    minmax(patch.number[fId.envAmp1Time] + direction, 0, patch.number[fId.envAmp2Time]),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `AmpMod2`,
        Math.round(patch.number[fId.envAmp2] * 100).toString(),
        Math.round(patch.number[fId.envAmp2Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.envAmp2, minmax(patch.number[fId.envAmp2] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envAmp2Time,
                    minmax(
                        patch.number[fId.envAmp2Time] + direction,
                        patch.number[fId.envAmp1Time],
                        patch.number[fId.envAmp3Time],
                    ),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `AmpMod3`,
        Math.round(patch.number[fId.envAmp3] * 100).toString(),
        Math.round(patch.number[fId.envAmp3Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.envAmp3, minmax(patch.number[fId.envAmp3] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envAmp3Time,
                    minmax(patch.number[fId.envAmp3Time] + direction, patch.number[fId.envAmp2Time], 1),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );

    drawEnvelope(
        [
            [1.0, 0.0],
            [patch.number[fId.envFreq1], patch.number[fId.envFreq1Time]],
            [patch.number[fId.envFreq2], patch.number[fId.envFreq2Time]],
            [patch.number[fId.envFreq3], patch.number[fId.envFreq3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2, scrollY },
    );
    drawFieldDual(
        `FrqMod1`,
        Math.round(patch.number[fId.envFreq1] * 100).toString(),
        Math.round(patch.number[fId.envFreq1Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.envFreq1, minmax(patch.number[fId.envFreq1] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envFreq1Time,
                    minmax(patch.number[fId.envFreq1Time] + direction, 0, patch.number[fId.envFreq2Time]),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `FrqMod2`,
        Math.round(patch.number[fId.envFreq2] * 100).toString(),
        Math.round(patch.number[fId.envFreq2Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.envFreq2, minmax(patch.number[fId.envFreq2] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envFreq2Time,
                    minmax(
                        patch.number[fId.envFreq2Time] + direction,
                        patch.number[fId.envFreq1Time],
                        patch.number[fId.envFreq3Time],
                    ),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );
    drawFieldDual(
        `FrqMod3`,
        Math.round(patch.number[fId.envFreq3] * 100).toString(),
        Math.round(patch.number[fId.envFreq3Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.setNumber(fId.envFreq3, minmax(patch.number[fId.envFreq3] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envFreq3Time,
                    minmax(patch.number[fId.envFreq3Time] + direction, patch.number[fId.envFreq2Time], 1),
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t', scrollY },
    );

    drawFieldDual(
        ``,
        `Save`,
        `Reload`,
        row++,
        {
            edit: () => {},
        },
        {
            edit: () => {},
        },
        { scrollY },
    );
}
