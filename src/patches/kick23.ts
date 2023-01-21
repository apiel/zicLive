import { getWavetable } from 'zic_node';
import { drawFilledRect, drawPoint, drawRect, rgb, setColor } from 'zic_node_ui';
import { DATA_PATH } from '../config';
import { drawField } from '../draw';
import { color, unit } from '../style';

function drawWavetable() {
    // float f = wavetable.getSampleCount() / (float)width;
    setColor(color.foreground);
    const rect = {
        position: { x: unit.margin + unit.halfScreen, y: unit.margin },
        size: {
            w: unit.halfScreen - unit.margin * 2,
            h: unit.height * 3 - unit.margin * 3,
        },
    };
    drawFilledRect(rect);
    setColor(rgb('#595f6b'));
    const wavetable = getWavetable(`${DATA_PATH}/wavetables/0_test.wav`);
    const f = wavetable.length / rect.size.w;
    for (let i = 0; i < rect.size.w; i++) {
        const sample = wavetable[Math.round(i * f)];
        drawPoint({
            x: rect.position.x + i,
            y: rect.position.y + (rect.size.h - sample * rect.size.h) * 0.5,
        });
    }
}

export default function () {
    drawWavetable();
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
