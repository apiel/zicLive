import path from 'path';
import { getWavetable } from 'zic_node';
import { drawEnvelope, drawField, drawFieldDual, drawWavetable } from '../draw';
import { Patch } from '../patch';
import { minmax } from '../util';

enum FloatId {
    Volume = 0,
    Morph,
    Duration,
    Frequency,
    envAmp1,
    envAmp1Time,
    envAmp2,
    envAmp2Time,
    envAmp3,
    envAmp3Time,
    envFreq1,
    envFreq1Time,
    envFreq2,
    envFreq2Time,
    envFreq3,
    envFreq3Time,
}

enum StringId {
    Wavetable = 0,
}

export default function (patch: Patch) {
    let row = 0;
    drawWavetable(getWavetable(patch.str[StringId.Wavetable]), { row, col: 2 });
    drawField(`Wavetable`, path.parse(patch.str[StringId.Wavetable]).name, row++, {
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
            [patch.float[FloatId.envAmp1], patch.float[FloatId.envAmp1Time]],
            [patch.float[FloatId.envAmp2], patch.float[FloatId.envAmp2Time]],
            [patch.float[FloatId.envAmp2], patch.float[FloatId.envAmp3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2 },
    );
    drawFieldDual(
        `AmpMod1`,
        Math.round(patch.float[FloatId.envAmp1] * 100).toString(),
        Math.round(patch.float[FloatId.envAmp1Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[FloatId.envAmp1] = minmax(
                    patch.float[FloatId.envAmp1] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[FloatId.envAmp1Time] = minmax(
                    patch.float[FloatId.envAmp1Time] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod2`,
        Math.round(patch.float[FloatId.envAmp2] * 100).toString(),
        Math.round(patch.float[FloatId.envAmp2Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[FloatId.envAmp2] = minmax(
                    patch.float[FloatId.envAmp2] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[FloatId.envAmp2Time] = minmax(
                    patch.float[FloatId.envAmp2Time] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod3`,
        Math.round(patch.float[FloatId.envAmp3] * 100).toString(),
        Math.round(patch.float[FloatId.envAmp3Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[FloatId.envAmp3] = minmax(
                    patch.float[FloatId.envAmp3] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[FloatId.envAmp3Time] = minmax(
                    patch.float[FloatId.envAmp3Time] + direction,
                    0,
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
            [patch.float[FloatId.envFreq1], patch.float[FloatId.envFreq1Time]],
            [patch.float[FloatId.envFreq2], patch.float[FloatId.envFreq2Time]],
            [patch.float[FloatId.envFreq3], patch.float[FloatId.envFreq3Time]],
            [0.0, 1.0],
        ],
        { row, col: 2 },
    );
    drawFieldDual(
        `FrqMod1`,
        Math.round(patch.float[FloatId.envFreq1] * 100).toString(),
        Math.round(patch.float[FloatId.envFreq1Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[FloatId.envFreq1] = minmax(
                    patch.float[FloatId.envFreq1] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[FloatId.envFreq1Time] = minmax(
                    patch.float[FloatId.envFreq1Time] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod2`,
        Math.round(patch.float[FloatId.envFreq2] * 100).toString(),
        Math.round(patch.float[FloatId.envFreq2Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[FloatId.envFreq2] = minmax(
                    patch.float[FloatId.envFreq2] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[FloatId.envFreq2Time] = minmax(
                    patch.float[FloatId.envFreq2Time] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod3`,
        Math.round(patch.float[FloatId.envFreq3] * 100).toString(),
        Math.round(patch.float[FloatId.envFreq3Time] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[FloatId.envFreq3] = minmax(
                    patch.float[FloatId.envFreq3] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[FloatId.envFreq3Time] = minmax(
                    patch.float[FloatId.envFreq3Time] + direction,
                    0,
                    1,
                );
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
}
