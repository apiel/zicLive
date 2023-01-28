import { drawSelectableText } from './drawSelectable';
import { color, unit } from '../style';
import { DrawOptions, getDrawRect } from './getDrawRect';

interface KeyboardOptions extends DrawOptions {
    done?: string;
}

export function drawKeyboard(edit: (char: string) => void, options: KeyboardOptions = {}) {
    const { done = 'OK' } = options;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_#$+@!~:';
    const countPerRow = 13;
    const { position, size } = getDrawRect(options);
    position.y -= 3;
    for (let c = 0; c < chars.length; c++) {
        drawSelectableText(
            chars[c],
            {
                x: position.x + ((c % countPerRow) * size.w) / countPerRow,
                y: position.y + Math.floor(c / countPerRow) * unit.height,
            },
            { size: 14, color: color.info },
            {
                edit: () => edit(chars[c]),
            },
        );
    }
    drawSelectableText(
        'DEL',
        {
            x: position.x + 120,
            y: position.y + 3 * unit.height,
        },
        { size: 14, color: color.info },
        {
            edit: () => edit('DEL'),
        },
    );
    drawSelectableText(
        done,
        {
            x: position.x + 160,
            y: position.y + 3 * unit.height,
        },
        { size: 14, color: color.info },
        {
            edit: () => edit('DONE'),
        },
    );
}
