"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encoderNode = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const style_1 = require("../style");
const { margin } = style_1.unit;
const top = 90;
const size = {
    w: config_1.config.screen.size.w / 4 - margin,
    h: (config_1.config.screen.size.h - top) / 2 - margin * 2,
};
const getRect = (id) => {
    return {
        position: {
            x: margin + (margin + size.w) * (id % 4),
            y: top + margin + (margin + size.h) * Math.floor(id / 4),
        },
        size,
    };
};
function encoderNode(encoders) {
    for (let i = 0; i < 8; i++) {
        const rect = getRect(i);
        (0, zic_node_ui_1.setColor)(style_1.color.foreground);
        (0, zic_node_ui_1.drawFilledRect)(rect);
        if (encoders[i]) {
            const { title } = encoders[i];
            (0, zic_node_ui_1.drawText)(title, { x: rect.position.x + 4, y: rect.position.y + 1 }, { color: style_1.color.foreground3, size: 10, font: style_1.font.bold });
        }
    }
}
exports.encoderNode = encoderNode;
