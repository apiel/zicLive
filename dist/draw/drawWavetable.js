"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawWavetable = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const style_1 = require("../style");
const getDrawRect_1 = require("./getDrawRect");
function drawWavetable(wavetable, options = {}) {
    (0, zic_node_ui_1.setColor)(style_1.color.foreground);
    const rect = (0, getDrawRect_1.getDrawRect)(options);
    (0, zic_node_ui_1.drawFilledRect)(rect);
    (0, zic_node_ui_1.setColor)(style_1.color.chart);
    const f = wavetable.length / rect.size.w;
    let prevPoint;
    for (let i = 0; i < rect.size.w; i++) {
        const sample = wavetable[Math.round(i * f)];
        // drawPoint({
        //     x: rect.position.x + i,
        //     y: rect.position.y + (rect.size.h - sample * rect.size.h) * 0.5,
        // });
        const point = {
            x: rect.position.x + i,
            y: rect.position.y + (rect.size.h - sample * rect.size.h) * 0.5,
        };
        if (prevPoint) {
            (0, zic_node_ui_1.drawLine)(prevPoint, point);
        }
        prevPoint = point;
    }
}
exports.drawWavetable = drawWavetable;
