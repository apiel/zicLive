"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawEnvelope = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const style_1 = require("../style");
const getDrawRect_1 = require("./getDrawRect");
function drawEnvelope(envelope, options = {}) {
    (0, zic_node_ui_1.setColor)(style_1.color.foreground);
    const rect = (0, getDrawRect_1.getDrawRect)(options);
    (0, zic_node_ui_1.drawFilledRect)(rect);
    (0, zic_node_ui_1.setColor)(style_1.color.chart);
    for (let i = 0; i < envelope.length - 1; i++) {
        const [value1, time1] = envelope[i];
        const [value2, time2] = envelope[i + 1];
        (0, zic_node_ui_1.drawLine)({
            x: rect.position.x + time1 * rect.size.w,
            y: rect.position.y + (1 - value1) * rect.size.h,
        }, {
            x: rect.position.x + time2 * rect.size.w,
            y: rect.position.y + (1 - value2) * rect.size.h,
        });
    }
}
exports.drawEnvelope = drawEnvelope;
