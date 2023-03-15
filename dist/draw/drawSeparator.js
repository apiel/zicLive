"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSeparator = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const style_1 = require("../style");
const getDrawRect_1 = require("./getDrawRect");
function drawSeparator(name, row, { scrollY, color } = {}) {
    const rect = (0, getDrawRect_1.getDrawRect)({ row, scrollY });
    if (color === undefined) {
        color = style_1.color.separator;
    }
    (0, zic_node_ui_1.setColor)(color);
    const text = (0, zic_node_ui_1.drawText)(name, { x: rect.position.x + 20, y: rect.position.y }, { size: 14, color });
    const y = rect.position.y + 7;
    (0, zic_node_ui_1.drawLine)({ x: rect.position.x - 3, y }, { x: rect.position.x + 16, y });
    (0, zic_node_ui_1.drawLine)({ x: rect.position.x + 24 + text.size.w, y }, { x: config_1.config.screen.size.w - 7, y });
}
exports.drawSeparator = drawSeparator;
