import { Color, drawFilledRect, drawText, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, font, unit } from '../style';

const { perRow } = config.encoder;
const { margin } = unit;
const top = 90;
const size = {
    w: config.screen.size.w / perRow - margin,
    h: (config.screen.size.h - top) / 2 - margin * 2,
};

const getRect = (id: number): Rect => {
    return {
        position: {
            x: margin + (margin + size.w) * (id % perRow),
            y: top + margin + (margin + size.h) * Math.floor(id / perRow),
        },
        size,
    };
};

export interface Encoder {
    title: string;
    value: string;
    valueColor?: Color;
}

export function encoderNode(index: number, encoder: Encoder | undefined) {
        const rect = getRect(index);
        setColor(color.foreground);
        drawFilledRect(rect);
        if (encoder) {
            const { title, value, valueColor } = encoder;
            drawText(
                title,
                { x: rect.position.x + 4, y: rect.position.y + 1 },
                { color: color.foreground3, size: 10, font: font.bold },
            );

            drawText(
                value,
                { x: rect.position.x + 4, y: rect.position.y + 35 },
                { color: valueColor ?? color.info, size: 16, font: font.bold },
            );
        }
}
