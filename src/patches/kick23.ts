import { getWavetable } from 'zic_node';
import { DATA_PATH } from '../config';
import { drawEnvelope, drawField, drawFieldDual, drawWavetable } from '../draw';

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
            info: `ms`,
        },
    );

    const envelopAmp: [number, number][] = [
        [0, 0],
        [1, 0.01],
        [0.3, 0.4],
        [0.0, 1.0],
        [0.0, 1.0],
        [0.0, 1.0],
    ];
    drawEnvelope(envelopAmp, { row, col: 2 });
    drawFieldDual(`AmpMod1`, `30`, `40`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    }, {info: '%', info2: '%t'});
    drawFieldDual(`AmpMod2`, `0`, `100`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    }, {info: '%', info2: '%t'});
    drawFieldDual(`AmpMod3`, `0`, `100`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    }, {info: '%', info2: '%t'});

    const envelopFreq: [number, number][] = [
        [1.0, 0.0],
        [1.0, 0.0],
        [0.26, 0.03],
        [0.24, 0.35],
        [0.22, 0.4],
        [0.0, 1.0],
    ];
    drawEnvelope(envelopFreq, { row, col: 2 });
    drawFieldDual(`FrqMod1`, `26`, `3`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    }, {info: '%', info2: '%t'});
    drawFieldDual(`FrqMod2`, `24`, `35`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    }, {info: '%', info2: '%t'});
    drawFieldDual(`FrqMod3`, `22`, `40`, row++, {
        edit: (direction) => {
            // const volume = minmax(getMasterVolume() + direction, 0, 1);
            // setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    }, {info: '%', info2: '%t'});
}
