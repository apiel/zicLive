import { Color, drawFilledRect, drawLine, drawText, Rect, setColor } from 'zic_node_ui';
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

export interface EncoderValue {
    value: string;
    valueColor?: Color;
}

export interface EncoderDefault {
    title: string;
    getValue: () => EncoderValue | string;
    unit?: string | (() => string);
    info?: string | (() => string);
    isDisabled?: () => boolean;
}

export interface EncoderSlider {
    title: string;
    getSlider: () => number;
    info?: string | (() => string);
    isDisabled?: () => boolean;
}

export type Encoder = EncoderDefault | EncoderSlider;

export function encoderNode(index: number, encoder: Encoder | undefined) {
    const rect = getRect(index);
    setColor(color.foreground);
    drawFilledRect(rect);
    if (encoder) {
        const { title } = encoder;
        drawText(
            title,
            { x: rect.position.x + 4, y: rect.position.y + 1 },
            { color: color.foreground3, size: 10, font: font.bold },
        );

        if (encoder.isDisabled?.()) {
            return;
        }

        if ('getValue' in encoder) {
            encoderDefault(rect, encoder);
        } else if ('getSlider' in encoder) {
            encoderSlider(rect, encoder);
        }
    }
}

function encoderSlider(rect: Rect, { getSlider, info }: EncoderSlider) {
    const value = getSlider();

    setColor(color.info);
    const sliderY = rect.position.y + (rect.size.h * 0.4);
    const x = rect.position.x + 5;
    const width = rect.size.w - 10;

    drawLine({ x, y: sliderY + 4 }, { x: x + width, y: sliderY + 4 });
    drawFilledRect({
        position: { x: x + (width * value) - 2, y: sliderY },
        size: { w: 4, h: 8 },
    });

    if (info) {
        drawText(
            typeof info === 'string' ? info : info(),
            { x: rect.position.x + 4, y: sliderY + 15 },
            { color: color.foreground3, size: 10, font: font.regular },
        );
    }
}

function encoderDefault(rect: Rect, { getValue, unit, info }: EncoderDefault) {
    const returnedValue = getValue();
    const value = typeof returnedValue === 'string' ? returnedValue : returnedValue.value;
    if (value) {
        const valueColor =
            typeof returnedValue === 'string' || returnedValue.valueColor === undefined
                ? color.info
                : returnedValue.valueColor;

        const valueRect = drawText(
            value,
            { x: rect.position.x + 4, y: rect.position.y + 35 },
            { color: valueColor, size: 16, font: font.bold },
        );

        if (unit) {
            drawText(
                typeof unit === 'string' ? unit : unit(),
                { x: valueRect.position.x + valueRect.size.w + 4, y: valueRect.position.y + 5 },
                { color: color.foreground3, size: 10, font: font.regular },
            );
        }

        if (info) {
            drawText(
                typeof info === 'string' ? info : info(),
                { x: rect.position.x + 4, y: rect.position.y + 65 },
                { color: color.foreground3, size: 10, font: font.regular },
            );
        }
    }
}
