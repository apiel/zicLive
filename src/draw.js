"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawButton = exports.drawField = exports.drawSelectableText = exports.drawSelectableRect = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const selector_1 = require("./selector");
const style_1 = require("./style");
function drawSelectableRect(rect, rectColor, options) {
    if ((0, selector_1.pushSelectableItem)(rect.position, options)) {
        (0, zic_node_ui_1.setColor)(rectColor);
        (0, zic_node_ui_1.drawRect)(rect);
    }
}
exports.drawSelectableRect = drawSelectableRect;
function drawSelectableText(text, position, textOptions, selectableOptions) {
    const rect = (0, zic_node_ui_1.drawText)(text, position, textOptions);
    drawSelectableRect({
        position: { x: rect.position.x - 2, y: rect.position.y - 2 },
        size: { w: rect.size.w + 4, h: rect.size.h + 3 },
    }, style_1.color.secondarySelected, selectableOptions);
}
exports.drawSelectableText = drawSelectableText;
function drawField(label, value, row, selectableOptions, options = {}) {
    const { col = 1, size = 1, info, valueColor = style_1.color.white, scrollY = 0 } = options;
    const rect = {
        position: { x: (col - 1) * style_1.unit.halfScreen, y: row * style_1.unit.height + style_1.unit.margin + scrollY },
        size: { w: style_1.unit.halfScreen * size, h: style_1.unit.height },
    };
    drawSelectableRect(rect, style_1.color.sequencer.selected, selectableOptions);
    (0, zic_node_ui_1.drawText)(label, { x: rect.position.x + 2, y: rect.position.y + 2 }, { size: 14, color: style_1.color.info });
    const labelRect = (0, zic_node_ui_1.drawText)(value, { x: rect.position.x + 80, y: rect.position.y + 2 }, { size: 14, color: valueColor });
    if (info) {
        (0, zic_node_ui_1.drawText)(info, { x: labelRect.position.x + labelRect.size.w + 2, y: rect.position.y + 6 }, { size: 10, color: style_1.color.info });
    }
}
exports.drawField = drawField;
function drawButton(text, row, edit, options = {}) {
    const { col = 1, size = 1, scrollY = 0 } = options;
    const rect = {
        position: { x: (col - 1) * style_1.unit.halfScreen, y: row * style_1.unit.height + style_1.unit.margin + scrollY },
        size: { w: style_1.unit.halfScreen * size, h: style_1.unit.height },
    };
    drawSelectableRect(rect, style_1.color.sequencer.selected, { edit });
    (0, zic_node_ui_1.drawText)(text, { x: rect.position.x + 80, y: rect.position.y + 4 }, { size: 14, color: style_1.color.info, font: style_1.font.bold });
}
exports.drawButton = drawButton;
