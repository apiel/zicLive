"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDrawRect = exports.getColPosition = void 0;
const config_1 = require("../config");
const style_1 = require("../style");
function getColPosition(col) {
    return style_1.unit.halfScreen * (col - 1);
}
exports.getColPosition = getColPosition;
const rowHeight = 3;
const size = {
    w: (config_1.config.screen.col === 1 ? config_1.config.screen.size.w : style_1.unit.halfScreen) - style_1.unit.margin * 2 - style_1.unit.extraMargin * 2,
    h: style_1.unit.height * rowHeight - style_1.unit.margin * rowHeight - style_1.unit.extraMargin * 2,
};
function getDrawRect({ row = 0, scrollY = 0, col = 1 }) {
    return {
        position: {
            x: style_1.unit.margin + style_1.unit.extraMargin + getColPosition(col),
            y: scrollY + style_1.unit.margin + row * style_1.unit.height + style_1.unit.extraMargin,
        },
        size,
    };
}
exports.getDrawRect = getDrawRect;
