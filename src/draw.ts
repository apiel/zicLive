import { Color, drawFilledRect, drawPoint, drawRect, drawText, Point, Rect, setColor, TextOptions } from 'zic_node_ui';
import { EditHandler, pushSelectableItem, SelectableOptions } from './selector';
import { color, font, unit } from './style';

export function drawSelectableRect(rect: Rect, rectColor: Color, options: SelectableOptions) {
    if (pushSelectableItem(rect.position, options)) {
        setColor(rectColor);
        drawRect(rect);
    }
}

export function drawSelectableText(
    text: string,
    position: Point,
    textOptions: TextOptions,
    selectableOptions: SelectableOptions,
) {
    const rect = drawText(text, position, textOptions);
    drawSelectableRect(
        {
            position: { x: rect.position.x - 2, y: rect.position.y - 2 },
            size: { w: rect.size.w + 4, h: rect.size.h + 3 },
        },
        color.secondarySelected,
        selectableOptions,
    );
}

export interface FieldOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    info?: string;
    valueColor?: Color;
    scrollY?: number;
}

export function drawField(
    label: string,
    value: string,
    row: number,
    selectableOptions: SelectableOptions,
    options: FieldOptions = {},
) {
    const { col = 1, size = 1, info, valueColor = color.white, scrollY = 0 } = options;
    const rect = {
        position: { x: (col - 1) * unit.halfScreen, y: row * unit.height + unit.margin + scrollY },
        size: { w: unit.halfScreen * size, h: unit.height },
    };

    drawSelectableRect(rect, color.sequencer.selected, selectableOptions);
    drawText(
        label,
        { x: rect.position.x + 2, y: rect.position.y + 2 },
        { size: 14, color: color.info },
    );
    const labelRect = drawText(
        value,
        { x: rect.position.x + 80, y: rect.position.y + 2 },
        { size: 14, color: valueColor },
    );
    if (info) {
        drawText(
            info,
            { x: labelRect.position.x + labelRect.size.w + 2, y: rect.position.y + 6 },
            { size: 10, color: color.info },
        );
    }
}

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

export function drawWavetable(wavetable: number[], row = 0) {
    setColor(color.foreground);
    const rowHeight = 3;
    const rect = {
        position: { x: unit.margin + unit.halfScreen, y: unit.margin + row * unit.height},
        size: {
            w: unit.halfScreen - unit.margin * 2,
            h: unit.height * rowHeight - unit.margin * rowHeight,
        },
    };
    drawFilledRect(rect);
    setColor(color.chart);
    const f = wavetable.length / rect.size.w;
    for (let i = 0; i < rect.size.w; i++) {
        const sample = wavetable[Math.round(i * f)];
        drawPoint({
            x: rect.position.x + i,
            y: rect.position.y + (rect.size.h - sample * rect.size.h) * 0.5,
        });
    }
}
