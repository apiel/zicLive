import { getWavetable } from 'zic_node';
import { DATA_PATH } from '../config';
import { drawEnvelope, drawField, drawFieldDual, drawWavetable } from '../draw';
import { minmax } from '../util';

export default function () {
    const envelopFreq: [number, number][] = [
        [1.0, 0.0],
        [1.0, 0.0],
        [0.26, 0.03],
        [0.24, 0.35],
        [0.22, 0.4],
        [0.0, 1.0],
    ];
    const envelopAmp: [number, number][] = [
        [0, 0],
        [1, 0.01],
        [0.3, 0.4],
        [0.0, 1.0],
        [0.0, 1.0],
        [0.0, 1.0],
    ];
    let row = 0;
    drawWavetable(getWavetable(`${DATA_PATH}/wavetables/0_test.wav`), { row, col: 2 });
    drawField(`Wavetable`, `0_test.wav`, row++, {
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

    drawEnvelope(envelopAmp, { row, col: 2 });
    drawFieldDual(
        `AmpMod1`,
        (envelopAmp[2][0] * 100).toString(),
        (envelopAmp[2][1] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                envelopAmp[2][0] = minmax(envelopAmp[2][0] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                envelopAmp[2][1] = minmax(envelopAmp[2][1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod2`,
        (envelopAmp[3][0] * 100).toString(),
        (envelopAmp[3][1] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                envelopAmp[3][0] = minmax(envelopAmp[3][0] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                envelopAmp[3][1] = minmax(envelopAmp[3][1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `AmpMod3`,
        (envelopAmp[4][0] * 100).toString(),
        (envelopAmp[4][1] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                envelopAmp[4][0] = minmax(envelopAmp[4][0] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                envelopAmp[4][1] = minmax(envelopAmp[4][1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );

    drawEnvelope(envelopFreq, { row, col: 2 });
    drawFieldDual(
        `FrqMod1`,
        (envelopFreq[2][0] * 100).toString(),
        (envelopFreq[2][1] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                envelopFreq[2][0] = minmax(envelopFreq[2][0] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                envelopFreq[2][1] = minmax(envelopFreq[2][1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod2`,
        (envelopFreq[3][0] * 100).toString(),
        (envelopFreq[3][1] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                envelopFreq[3][0] = minmax(envelopFreq[3][0] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                envelopFreq[3][1] = minmax(envelopFreq[3][1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
    drawFieldDual(
        `FrqMod3`,
        (envelopFreq[4][0] * 100).toString(),
        (envelopFreq[4][1] * 100).toString(),
        row++,
        {
            edit: (direction) => {
                envelopFreq[4][0] = minmax(envelopFreq[4][0] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        {
            edit: (direction) => {
                envelopFreq[4][1] = minmax(envelopFreq[4][1] + direction, 0, 1);
            },
            steps: [0.01, 0.1],
        },
        { info: '%', info2: '%t' },
    );
}
