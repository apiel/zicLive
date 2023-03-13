"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSliderField = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const style_1 = require("../style");
const drawField_1 = require("./drawField");
const drawSelectable_1 = require("./drawSelectable");
function drawSliderField(label, value, row, selectableOptions, options = {}) {
    const { valueColor = style_1.color.white, leftLabel = '0%', rightLabel = '100%', width = 100 } = options;
    const rect = (0, drawField_1.getFieldRect)(row, options);
    (0, drawSelectable_1.drawSelectableRect)(rect, style_1.color.sequencer.selected, selectableOptions);
    const labelRect = (0, zic_node_ui_1.drawText)(label, { x: rect.position.x + 2, y: rect.position.y + 2 }, { size: 14, color: style_1.color.info });
    const leftRect = (0, zic_node_ui_1.drawText)(leftLabel, { x: labelRect.position.x + labelRect.size.w + 10, y: rect.position.y + 5 }, { size: 10, color: style_1.color.info });
    (0, zic_node_ui_1.setColor)(valueColor);
    const sliderY = rect.position.y + 8;
    const x = leftRect.position.x + leftRect.size.w + 5;
    (0, zic_node_ui_1.drawLine)({ x, y: sliderY + 4 }, { x: x + width, y: sliderY + 4 });
    (0, zic_node_ui_1.drawFilledRect)({
        position: { x: x + (width * value) - 2, y: sliderY },
        size: { w: 4, h: 8 },
    });
    (0, zic_node_ui_1.drawText)(rightLabel, { x: x + width + 5, y: rect.position.y + 5 }, { size: 10, color: style_1.color.info });
}
exports.drawSliderField = drawSliderField;
