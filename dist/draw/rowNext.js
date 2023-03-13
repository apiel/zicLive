"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowGet = exports.rowReset = exports.rowGetAndAdd = exports.rowAdd = exports.rowNext = void 0;
const config_1 = require("../config");
// TODO might want  to use: row[col]...
let row = -1;
let previousCol = 0;
exports.rowNext = config_1.config.screen.col === 1 ? (_col) => row++ : (col) => {
    if (col > previousCol) {
        previousCol = col;
        return row;
    }
    previousCol = col;
    return ++row;
};
/**
 * Add a number to the row counter and return it
 * @param add
 * @returns
 */
const rowAdd = (add) => {
    row += add;
    return row;
};
exports.rowAdd = rowAdd;
/**
 * Make a copy of the current row counter, add a number to it and return the orignal copy.
 * So we return the value before the addition was done.
 *
 * @param add
 * @returns
 */
const rowGetAndAdd = (add) => {
    const r = row;
    row += add;
    return r;
};
exports.rowGetAndAdd = rowGetAndAdd;
const rowReset = (_row = -1) => {
    row = _row;
};
exports.rowReset = rowReset;
const rowGet = () => row;
exports.rowGet = rowGet;
