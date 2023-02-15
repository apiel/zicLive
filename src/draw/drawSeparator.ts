import { Color, drawLine, drawText, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color as _color, unit } from '../style';
import { getDrawRect } from './getDrawRect';

export interface SeparatorOptions {
    color?: Color;
    scrollY?: number;
}

export function drawSeparator(name: string, row: number, { scrollY, color }: SeparatorOptions = {}) {
    const rect = getDrawRect({ row, scrollY });
    if (color === undefined) {
        color = _color.separator;
    }
    setColor(color);
    const text = drawText(name, { x: rect.position.x + 20, y: rect.position.y }, { size: 14, color });

    const y = rect.position.y + 7;

    drawLine({ x: rect.position.x - 3, y }, { x: rect.position.x + 16, y });
    drawLine({ x: rect.position.x + 24 + text.size.w, y }, { x: config.screen.size.w - 7, y });
}
