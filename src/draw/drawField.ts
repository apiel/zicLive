import { Color, drawText } from 'zic_node_ui';
import { drawSelectableRect, drawSelectableText } from './drawSelectable';
import { SelectableOptions } from '../selector';
import { color, unit } from '../style';
import { config } from '../config';

export interface FieldOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    info?: string;
    valueColor?: Color;
    scrollY?: number;
}

// TODO can this be generic?
export function getFieldRect(row: number, options: FieldOptions) {
    const { col = 1, size = 1, scrollY = 0 } = options;
    return {
        position: { x: (col - 1) * unit.halfScreen, y: row * unit.height + scrollY  + unit.margin }, // need to keep margin for selection
        size: { w: config.screen.col === 1 ? config.screen.size.w : unit.halfScreen * size, h: unit.height },
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
    const rect = getFieldRect(row, options);
    drawSelectableRect(rect, color.sequencer.selected, selectableOptions);
    drawText(label, { x: rect.position.x + 2, y: rect.position.y + 2 }, { size: 14, color: color.info });
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
    valueColor2?: Color;
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
    const { info, info2, valueColor = color.white, valueColor2 = color.white } = options;
    const rect = getFieldRect(row, options);
    drawText(label, { x: rect.position.x + 2, y: rect.position.y + 2 }, { size: 14, color: color.info });
    const labelRect = drawSelectableText(
        value1,
        { x: rect.position.x + 80, y: rect.position.y + 2 },
        { size: 14, color: valueColor },
        selectableOptions1,
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
        { size: 14, color: valueColor2 },
        selectableOptions2,
    );
    if (info2) {
        drawText(
            info2,
            { x: labelRect2.position.x + labelRect2.size.w + 2, y: rect.position.y + 6 },
            { size: 10, color: color.info },
        );
    }
}
