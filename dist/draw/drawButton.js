"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawButton = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const drawSelectable_1 = require("./drawSelectable");
const style_1 = require("../style");
const getDrawRect_1 = require("./getDrawRect");
const config_1 = require("../config");
function drawButton(text, row, edit, options = {}) {
    const { col = 1, size = 1, scrollY = 0 } = options;
    // TODO can this be generic?
    const rect = {
        position: { x: (0, getDrawRect_1.getColPosition)(col), y: row * style_1.unit.height + style_1.unit.margin + scrollY },
        size: { w: config_1.config.screen.col === 1 ? config_1.config.screen.size.w : style_1.unit.halfScreen * size, h: style_1.unit.height },
    };
    (0, drawSelectable_1.drawSelectableRect)(rect, style_1.color.sequencer.selected, { edit });
    (0, zic_node_ui_1.drawText)(text, { x: rect.position.x + 80, y: rect.position.y + 4 }, { size: 14, color: style_1.color.info, font: style_1.font.bold });
}
exports.drawButton = drawButton;
