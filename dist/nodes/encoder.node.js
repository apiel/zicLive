"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encoderNode = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const style_1 = require("../style");
const { perRow } = config_1.config.encoder;
const { margin } = style_1.unit;
const top = 90;
const size = {
    w: config_1.config.screen.size.w / perRow - margin,
    h: (config_1.config.screen.size.h - top) / 2 - margin * 2,
};
const getRect = (id) => {
    return {
        position: {
            x: margin + (margin + size.w) * (id % perRow),
            y: top + margin + (margin + size.h) * Math.floor(id / perRow),
        },
        size,
    };
};
function encoderNode(index, encoder) {
    const rect = getRect(index);
    (0, zic_node_ui_1.setColor)(style_1.color.foreground);
    (0, zic_node_ui_1.drawFilledRect)(rect);
    if (encoder) {
        const { title, getValue, unit } = encoder;
        (0, zic_node_ui_1.drawText)(title, { x: rect.position.x + 4, y: rect.position.y + 1 }, { color: style_1.color.foreground3, size: 10, font: style_1.font.bold });
        const returnedValue = getValue();
        const value = typeof returnedValue === 'string' ? returnedValue : returnedValue.value;
        if (value) {
            const valueColor = typeof returnedValue === 'string' || returnedValue.valueColor === undefined
                ? style_1.color.info
                : returnedValue.valueColor;
            const valueRect = (0, zic_node_ui_1.drawText)(value, { x: rect.position.x + 4, y: rect.position.y + 35 }, { color: valueColor, size: 16, font: style_1.font.bold });
            if (unit) {
                (0, zic_node_ui_1.drawText)(typeof unit === 'string' ? unit : unit(), { x: valueRect.position.x + valueRect.size.w + 4, y: valueRect.position.y + 5 }, { color: style_1.color.foreground3, size: 10, font: style_1.font.regular });
            }
        }
    }
}
exports.encoderNode = encoderNode;
