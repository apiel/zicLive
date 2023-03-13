"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawKeyboard = void 0;
const drawSelectable_1 = require("./drawSelectable");
const style_1 = require("../style");
const getDrawRect_1 = require("./getDrawRect");
function drawKeyboard(edit, options = {}) {
    const { done = 'OK' } = options;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_#$+@!~:';
    const countPerRow = 13;
    const { position, size } = (0, getDrawRect_1.getDrawRect)(options);
    position.y -= 3;
    for (let c = 0; c < chars.length; c++) {
        (0, drawSelectable_1.drawSelectableText)(chars[c], {
            x: position.x + ((c % countPerRow) * size.w) / countPerRow,
            y: position.y + Math.floor(c / countPerRow) * style_1.unit.height,
        }, { size: 14, color: style_1.color.info }, {
            edit: () => edit(chars[c]),
        });
    }
    (0, drawSelectable_1.drawSelectableText)('DEL', {
        x: position.x + 120,
        y: position.y + 3 * style_1.unit.height,
    }, { size: 14, color: style_1.color.info }, {
        edit: () => edit('DEL'),
    });
    (0, drawSelectable_1.drawSelectableText)(done, {
        x: position.x + 160,
        y: position.y + 3 * style_1.unit.height,
    }, { size: 14, color: style_1.color.info }, {
        edit: () => edit('DONE'),
    });
}
exports.drawKeyboard = drawKeyboard;
