"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSelectableText = exports.drawSelectableRect = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const selector_1 = require("../selector");
const style_1 = require("../style");
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
    return rect;
}
exports.drawSelectableText = drawSelectableText;
