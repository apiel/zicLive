import { drawText } from 'zic_node_ui';
import { drawSelectableRect } from './drawSelectable';
import { EditHandler } from '../selector';
import { color, font, unit } from '../style';

export interface ButtonOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    scrollY?: number;
}

export function drawButton(text: string, row: number, edit: EditHandler, options: ButtonOptions = {}) {
    const { col = 1, size = 1, scrollY = 0 } = options;
    const rect = {
        position: { x: (col - 1) * unit.halfScreen, y: row * unit.height + unit.margin + scrollY },
        size: { w: unit.halfScreen * size, h: unit.height },
    };

    drawSelectableRect(rect, color.sequencer.selected, { edit });
    drawText(
        text,
        { x: rect.position.x + 80, y: rect.position.y + 4 },
        { size: 14, color: color.info, font: font.bold },
    );
}