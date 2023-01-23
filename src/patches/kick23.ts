import path from 'path';
import { getWavetable } from 'zic_node';
import { DATA_PATH } from '../config';
import { drawEnvelope, drawField, drawFieldDual, drawWavetable } from '../draw';
import { Patch } from '../patch';
import { minmax } from '../util';

export default function (patch: Patch) {
    let row = 0;
    drawWavetable(getWavetable(`${DATA_PATH}/wavetables/0_test.wav`), { row, col: 2 });
    drawField(`Wavetable`, path.parse(patch.str[0]).name, row++, {
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

    drawEnvelope([
        [0, 0],
        [1, 0.01], // Force to have a very short ramp up to avoid clicks 
        [patch.float[4], patch.float[5]],
        [patch.float[6], patch.float[7]],
        [patch.float[8], patch.float[9]],
        [0.0, 1.0],
    ], { row, col: 2 });
    drawFieldDual(
        `AmpMod1`,
        Math.round(patch.float[4] * 100).toString(),
        Math.round(patch.float[5] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[4] = minmax(patch.float[4] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[5] = minmax(patch.float[5] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod2`,
        Math.round(patch.float[6] * 100).toString(),
        Math.round(patch.float[7] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[6] = minmax(patch.float[6] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[7] = minmax(patch.float[7] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod3`,
        Math.round(patch.float[8] * 100).toString(),
        Math.round(patch.float[9] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[8] = minmax(patch.float[8] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[9] = minmax(patch.float[9] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );

    drawEnvelope([
        [1.0, 0.0],
        [patch.float[10], patch.float[11]],
        [patch.float[12], patch.float[13]],
        [patch.float[14], patch.float[15]],
        [0.0, 1.0],
    ], { row, col: 2 });
    drawFieldDual(
        `FrqMod1`,
        Math.round(patch.float[10] * 100).toString(),
        Math.round(patch.float[11] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[10] = minmax(patch.float[10] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[11] = minmax(patch.float[11] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod2`,
        Math.round(patch.float[12] * 100).toString(),
        Math.round(patch.float[13] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[12] = minmax(patch.float[12] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[13] = minmax(patch.float[13] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod3`,
        Math.round(patch.float[14] * 100).toString(),
        Math.round(patch.float[15] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                patch.float[14] = minmax(patch.float[14] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                patch.float[15] = minmax(patch.float[15] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
}
