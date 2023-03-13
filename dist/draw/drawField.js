"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawFieldDual = exports.drawField = exports.getFieldRect = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const drawSelectable_1 = require("./drawSelectable");
const style_1 = require("../style");
const config_1 = require("../config");
// TODO can this be generic?
function getFieldRect(row, options) {
    const { col = 1, size = 1, scrollY = 0 } = options;
    return {
        position: { x: (col - 1) * style_1.unit.halfScreen, y: row * style_1.unit.height + scrollY + style_1.unit.margin },
        size: { w: config_1.config.screen.col === 1 ? config_1.config.screen.size.w : style_1.unit.halfScreen * size, h: style_1.unit.height },
    };
}
exports.getFieldRect = getFieldRect;
function drawField(label, value, row, selectableOptions, options = {}) {
    const { info, valueColor = style_1.color.white } = options;
    const rect = getFieldRect(row, options);
    (0, drawSelectable_1.drawSelectableRect)(rect, style_1.color.sequencer.selected, selectableOptions);
    (0, zic_node_ui_1.drawText)(label, { x: rect.position.x + 2, y: rect.position.y + 2 }, { size: 14, color: style_1.color.info });
    const labelRect = (0, zic_node_ui_1.drawText)(value, { x: rect.position.x + 80, y: rect.position.y + 2 }, { size: 14, color: valueColor });
    if (info) {
        (0, zic_node_ui_1.drawText)(info, { x: labelRect.position.x + labelRect.size.w + 2, y: rect.position.y + 6 }, { size: 10, color: style_1.color.info });
    }
}
exports.drawField = drawField;
function drawFieldDual(label, value1, value2, row, selectableOptions1, selectableOptions2, options = {}) {
    const { info, info2, valueColor = style_1.color.white, valueColor2 = style_1.color.white } = options;
    const rect = getFieldRect(row, options);
    (0, zic_node_ui_1.drawText)(label, { x: rect.position.x + 2, y: rect.position.y + 2 }, { size: 14, color: style_1.color.info });
    const labelRect = (0, drawSelectable_1.drawSelectableText)(value1, { x: rect.position.x + 80, y: rect.position.y + 2 }, { size: 14, color: valueColor }, selectableOptions1);
    if (info) {
        (0, zic_node_ui_1.drawText)(info, { x: labelRect.position.x + labelRect.size.w + 2, y: rect.position.y + 6 }, { size: 10, color: style_1.color.info });
    }
    if (value2) {
        const labelRect2 = (0, drawSelectable_1.drawSelectableText)(value2, { x: rect.position.x + 140, y: rect.position.y + 2 }, { size: 14, color: valueColor2 }, selectableOptions2);
        if (info2) {
            (0, zic_node_ui_1.drawText)(info2, { x: labelRect2.position.x + labelRect2.size.w + 2, y: rect.position.y + 6 }, { size: 10, color: style_1.color.info });
        }
    }
}
exports.drawFieldDual = drawFieldDual;
