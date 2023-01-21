import { drawField } from '../../../dist/draw';

export function patchEditor() {
    let row = 0;
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
}
