import { Color, drawFilledRect, drawLine, drawText, setColor } from 'zic_node_ui';
import { config } from '../config';
import { SelectableOptions } from '../selector';
import { color, color as _color, unit } from '../style';
import { FieldOptions, getFieldRect } from './drawField';
import { drawSelectableRect } from './drawSelectable';

export interface SliderOptions extends Omit<FieldOptions, 'info'> {
    leftLabel?: string;
    rightLabel?: string;
    width?: number;
}

export function drawSliderField(
    label: string,
    value: number,
    row: number,
    selectableOptions: SelectableOptions,
    options: SliderOptions = {},
) {
    const { valueColor = color.white, leftLabel = '0%', rightLabel = '100%', width = 100 } = options;
    const rect = getFieldRect(row, options);
    drawSelectableRect(rect, color.sequencer.selected, selectableOptions);
    const labelRect = drawText(
        label,
        { x: rect.position.x + 2, y: rect.position.y + 2 },
        { size: 14, color: color.info },
    );
    // drawText(value.toString(), { x: rect.position.x + 80, y: rect.position.y + 2 }, { size: 14, color: valueColor });

    const leftRect = drawText(
        leftLabel,
        { x: labelRect.position.x + labelRect.size.w + 10, y: rect.position.y + 5 },
        { size: 10, color: color.info },
    );

    setColor(valueColor);
    const sliderY = rect.position.y + 8;
    const x = leftRect.position.x + leftRect.size.w + 5;
    drawLine({ x, y: sliderY + 4 }, { x: x + width, y: sliderY + 4 });
    drawFilledRect({
        position: { x: x + (width * value) - 2, y: sliderY },
        size: { w: 4, h: 8 },
    });

    drawText(rightLabel, { x: x + width + 5, y: rect.position.y + 5 }, { size: 10, color: color.info });
}

// export function drawSlider(name: string, row: number, { scrollY, color }: SliderOptions = {}) {
//     const rect = getDrawRect({ row, scrollY });
//     if (color === undefined) {
//         color = _color.separator;
//     }
//     setColor(color);
//     const text = drawText(name, { x: rect.position.x + 20, y: rect.position.y }, { size: 14, color });

//     const y = rect.position.y + 7;

//     drawLine({ x: rect.position.x - 3, y }, { x: rect.position.x + 16, y });
//     drawLine({ x: rect.position.x + 24 + text.size.w, y }, { x: config.screen.size.w - 7, y });
// }
