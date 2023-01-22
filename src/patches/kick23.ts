import { getWavetable } from 'zic_node';
import { DATA_PATH } from '../config';
import { drawEnvelope, drawField, drawWavetable } from '../draw';

export default function () {
    drawWavetable(getWavetable(`${DATA_PATH}/wavetables/0_test.wav`));
    let row = 0;
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
    drawEnvelope(envelopAmp, row);

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
