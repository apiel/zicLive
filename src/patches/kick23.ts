import { getWavetable } from 'zic_node';
import { DATA_PATH } from '../config';
import { drawEnvelope, drawField, drawWavetable } from '../draw';

export default function () {
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

    const envelopAmp: [number, number][] = [
        [0, 0],
        [1, 0.01],
        [0.3, 0.4],
        [0.0, 1.0],
        [0.0, 1.0],
        [0.0, 1.0],
    ];
    drawEnvelope(envelopAmp, { row, col: 2 });
    drawField(`AmpMod1`, `30% 300ms`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(`AmpMod2`, `0% 600ms`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(`AmpMod3`, `0% 600ms`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });

    const envelopFreq: [number, number][] = [
        [1.0, 0.0],
        [1.0, 0.0],
        [0.26, 0.03],
        [0.24, 0.35],
        [0.22, 0.4],
        [0.0, 1.0],
    ];
    drawEnvelope(envelopFreq, { row, col: 2 });
    drawField(`FrqMod1`, `26% 300ms`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(`FrqMod2`, `24% 350ms`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(`FrqMod3`, `22% 400ms`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });

    // drawField(`Volume`, Math.round(1 * 100).toString(), row, {
    //     edit: (direction) => {
    //         // const volume = minmax(getMasterVolume() + direction, 0, 1);
    //         // setMasterVolume(volume);
    //     },
    //     steps: [0.01, 0.1],
    // });
    // drawField(
    //     `Duration`,
    //     (500).toString(),
    //     row++,
    //     {
    //         edit: (direction) => {
    //             // setBpm(minmax(getBpm() + direction, 10, 250));
    //         },
    //     },
    //     {
    //         col: 2,
    //         info: `ms`,
    //     },
    // );
}
