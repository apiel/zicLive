import {
    Color,
    drawFilledRect,
    drawLine,
    drawPoint,
    drawRect,
    drawText,
    Point,
    Rect,
    setColor,
    TextOptions,
} from 'zic_node_ui';
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
    return rect;
}

export interface FieldOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    info?: string;
    valueColor?: Color;
    scrollY?: number;
}

function getFiledRect(row: number, options: FieldOptions) {
    const { col = 1, size = 1, scrollY = 0 } = options;
    return {
        position: { x: (col - 1) * unit.halfScreen, y: row * unit.height + unit.margin + scrollY },
        size: { w: unit.halfScreen * size, h: unit.height },
    };
}

export function drawField(
    label: string,
    value: string,
    row: number,
    selectableOptions: SelectableOptions,
    options: FieldOptions = {},
) {
    const { info, valueColor = color.white } = options;
    const rect = getFiledRect(row, options);
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

interface FieldDualOptions extends FieldOptions {
    info2?: string;
}

export function drawFieldDual(
    label: string,
    value1: string,
    value2: string,
    row: number,
    selectableOptions1: SelectableOptions,
    selectableOptions2: SelectableOptions,
    options: FieldDualOptions = {},
) {
    const { info, info2, valueColor = color.white } = options;
    const rect = getFiledRect(row, options);
    drawText(
        label,
        { x: rect.position.x + 2, y: rect.position.y + 2 },
        { size: 14, color: color.info },
    );
    const labelRect = drawSelectableText(
        value1,
        { x: rect.position.x + 80, y: rect.position.y + 2 },
        { size: 14, color: valueColor },
        selectableOptions1
    );
    if (info) {
        drawText(
            info,
            { x: labelRect.position.x + labelRect.size.w + 2, y: rect.position.y + 6 },
            { size: 10, color: color.info },
        );
    }
    const labelRect2 = drawSelectableText(
        value2,
        { x: rect.position.x + 140, y: rect.position.y + 2 },
        { size: 14, color: valueColor },
        selectableOptions2
    );
    if (info2) {
        drawText(
            info2,
            { x: labelRect2.position.x + labelRect2.size.w + 2, y: rect.position.y + 6 },
            { size: 10, color: color.info },
        );
    }
}

export interface ButtonOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    scrollY?: number;
}

export function drawButton(
    text: string,
    row: number,
    edit: EditHandler,
    options: ButtonOptions = {},
) {
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

interface ChartOptions {
    row?: number;
    scrollY?: number;
    col?: 1 | 2;
}

function getChartRect({ row = 0, scrollY = 0, col = 1 }: ChartOptions) {
    const rowHeight = 3;
    return {
        position: {
            x: unit.margin + unit.halfScreen * (col - 1),
            y: scrollY + unit.margin + row * unit.height + unit.extraMargin,
        },
        size: {
            w: unit.halfScreen - unit.margin * 2 - unit.extraMargin * 2,
            h: unit.height * rowHeight - unit.margin * rowHeight - unit.extraMargin * 2,
        },
    };
}

export function drawWavetable(wavetable: number[], options: ChartOptions = {}) {
    setColor(color.foreground);
    const rect = getChartRect(options);
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

export function drawEnvelope(envelope: [number, number][], options: ChartOptions = {}) {
    setColor(color.foreground);
    const rect = getChartRect(options);
    drawFilledRect(rect);
    setColor(color.chart);
    for (let i = 0; i < envelope.length - 1; i++) {
        const [value1, time1] = envelope[i];
        const [value2, time2] = envelope[i + 1];
        drawLine(
            {
                x: rect.position.x + time1 * rect.size.w,
                y: rect.position.y + (1 - value1) * rect.size.h,
            },
            {
                x: rect.position.x + time2 * rect.size.w,
                y: rect.position.y + (1 - value2) * rect.size.h,
            },
        );
    }
}
