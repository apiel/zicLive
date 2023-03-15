"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextWaveTable = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const util_1 = require("../util");
async function getNextWaveTable(direction, currentWaveTable) {
    const currentName = path_1.default.parse(currentWaveTable).base;
    const names = await (0, promises_1.readdir)(config_1.config.path.wavetables);
    const index = names.indexOf(currentName);
    if (index === -1) {
        return names[0];
    }
    const nextIndex = (0, util_1.minmax)(index + direction, 0, names.length - 1);
    // TODO #3 search wavetable: if direction > 1 get next letter
    return path_1.default.join(config_1.config.path.wavetables, names[nextIndex]);
}
exports.getNextWaveTable = getNextWaveTable;
