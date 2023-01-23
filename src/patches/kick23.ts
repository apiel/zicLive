import path from 'path';
import { getWavetable, Kick23 } from 'zic_node';
import { drawEnvelope, drawField, drawFieldDual, drawWavetable } from '../draw';
import { Patch } from '../patch';
import { minmax } from '../util';

const fId = Kick23.FloatId;
const sId = Kick23.StringId;

export default function (patch: Patch) {
    let row = 0;
    drawWavetable(getWavetable(patch.str[sId.Wavetable]), { row, col: 2 });
    drawField(`Wavetable`, path.parse(patch.str[sId.Wavetable]).name, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(`Morph`, `0`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(`Frequency`, `400`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });

    drawField(`Volume`, Math.round(1 * 100).toString(), row, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(
        `Duration`,
        (500).toString(),
        row++,
        {
            edit: (direction) => {
                // setBpm(minmax(getBpm() + direction, 10, 250));
            },
        },
        {
            col: 2,
            info: `ms (t)`,
        },
    );

    drawEnvelope(
        [
            [0, 0],
            [1, 0.01], // Force to have a very short ramp up to avoid clicks
            [patch.float[fId.envAmp1], patch.float[fId.envAmp1Time]],
            [patch.float[fId.envAmp2], patch.float[fId.envAmp2Time]],
            [patch.float[fId.envAmp2], patch.float[fId.envAmp3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2 },
    );
    drawFieldDual(
        `AmpMod1`,
        Math.round(patch.float[fId.envAmp1] * 100).toString(),
        Math.round(patch.float[fId.envAmp1Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[fId.envAmp1] = minmax(patch.float[fId.envAmp1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[fId.envAmp1Time] = minmax(
                    patch.float[fId.envAmp1Time] + direction,
                    0,
                    patch.float[fId.envAmp2Time],
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod2`,
        Math.round(patch.float[fId.envAmp2] * 100).toString(),
        Math.round(patch.float[fId.envAmp2Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[fId.envAmp2] = minmax(patch.float[fId.envAmp2] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[fId.envAmp2Time] = minmax(
                    patch.float[fId.envAmp2Time] + direction,
                    patch.float[fId.envAmp1Time],
                    patch.float[fId.envAmp3Time],
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod3`,
        Math.round(patch.float[fId.envAmp3] * 100).toString(),
        Math.round(patch.float[fId.envAmp3Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[fId.envAmp3] = minmax(patch.float[fId.envAmp3] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[fId.envAmp3Time] = minmax(
                    patch.float[fId.envAmp3Time] + direction,
                    patch.float[fId.envAmp2Time],
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );

    drawEnvelope(
        [
            [1.0, 0.0],
            [patch.float[fId.envFreq1], patch.float[fId.envFreq1Time]],
            [patch.float[fId.envFreq2], patch.float[fId.envFreq2Time]],
            [patch.float[fId.envFreq3], patch.float[fId.envFreq3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2 },
    );
    drawFieldDual(
        `FrqMod1`,
        Math.round(patch.float[fId.envFreq1] * 100).toString(),
        Math.round(patch.float[fId.envFreq1Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[fId.envFreq1] = minmax(patch.float[fId.envFreq1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[fId.envFreq1Time] = minmax(
                    patch.float[fId.envFreq1Time] + direction,
                    0,
                    patch.float[fId.envFreq2Time],
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod2`,
        Math.round(patch.float[fId.envFreq2] * 100).toString(),
        Math.round(patch.float[fId.envFreq2Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[fId.envFreq2] = minmax(patch.float[fId.envFreq2] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[fId.envFreq2Time] = minmax(
                    patch.float[fId.envFreq2Time] + direction,
                    patch.float[fId.envFreq1Time],
                    patch.float[fId.envFreq3Time],
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod3`,
        Math.round(patch.float[fId.envFreq3] * 100).toString(),
        Math.round(patch.float[fId.envFreq3Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[fId.envFreq3] = minmax(patch.float[fId.envFreq3] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[fId.envFreq3Time] = minmax(
                    patch.float[fId.envFreq3Time] + direction,
                    patch.float[fId.envFreq2Time],
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
}
