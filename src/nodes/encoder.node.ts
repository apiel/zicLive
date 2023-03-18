import { Color, drawFilledRect, drawText, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, font, unit } from '../style';

const { margin } = unit;
const top = 90;
const size = {
    w: config.screen.size.w / 4 - margin,
    h: (config.screen.size.h - top) / 2 - margin * 2,
};

const getRect = (id: number): Rect => {
    return {
        position: {
            x: margin + (margin + size.w) * (id % 4),
            y: top + margin + (margin + size.h) * Math.floor(id / 4),
        },
        size,
    };
};

export interface Encoder {
    title: string;
    value: string;
    valueColor?: Color;
}

export type Encoders = [
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
];

export function encoderNode(encoders: Encoders) {
    for (let i = 0; i < 8; i++) {
        const rect = getRect(i);
        setColor(color.foreground);
        drawFilledRect(rect);
        if (encoders[i]) {
            const { title, value, valueColor } = encoders[i] as Encoder;
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
}
