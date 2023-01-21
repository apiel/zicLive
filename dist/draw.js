import { drawRect, drawText, setColor } from 'zic_node_ui';
import { pushSelectableItem } from './selector';
import { color, font, unit } from './style';
export function drawSelectableRect(rect, rectColor, options) {
    if (pushSelectableItem(rect.position, options)) {
        setColor(rectColor);
        drawRect(rect);
    }
}
export function drawSelectableText(text, position, textOptions, selectableOptions) {
    const rect = drawText(text, position, textOptions);
    drawSelectableRect({
        position: { x: rect.position.x - 2, y: rect.position.y - 2 },
        size: { w: rect.size.w + 4, h: rect.size.h + 3 },
    }, color.secondarySelected, selectableOptions);
}
export function drawField(label, value, row, selectableOptions, options = {}) {
    const { col = 1, size = 1, info, valueColor = color.white, scrollY = 0 } = options;
    const rect = {
        position: { x: (col - 1) * unit.halfScreen, y: row * unit.height + unit.margin + scrollY },
        size: { w: unit.halfScreen * size, h: unit.height },
    };
    drawSelectableRect(rect, color.sequencer.selected, selectableOptions);
    drawText(label, { x: rect.position.x + 2, y: rect.position.y + 2 }, { size: 14, color: color.info });
    const labelRect = drawText(value, { x: rect.position.x + 80, y: rect.position.y + 2 }, { size: 14, color: valueColor });
    if (info) {
        drawText(info, { x: labelRect.position.x + labelRect.size.w + 2, y: rect.position.y + 6 }, { size: 10, color: color.info });
    }
}
export function drawButton(text, row, edit, options = {}) {
    const { col = 1, size = 1, scrollY = 0 } = options;
    const rect = {
        position: { x: (col - 1) * unit.halfScreen, y: row * unit.height + unit.margin + scrollY },
        size: { w: unit.halfScreen * size, h: unit.height },
    };
    drawSelectableRect(rect, color.sequencer.selected, { edit });
    drawText(text, { x: rect.position.x + 80, y: rect.position.y + 4 }, { size: 14, color: color.info, font: font.bold });
}
