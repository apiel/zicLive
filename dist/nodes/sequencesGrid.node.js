"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencesGridNode = exports.sequenceRect = void 0;
const style_1 = require("../style");
const config_1 = require("../config");
const sequences_node_1 = require("./sequences.node");
const sequence_1 = require("../sequence");
const { margin } = style_1.unit;
const height = config_1.config.screen.size.h / config_1.config.sequence.row;
const sequenceWidth = config_1.config.screen.size.w / config_1.config.sequence.col - margin;
const sequenceRect = (col) => (id, scrollY = 0) => {
    const size = { w: sequenceWidth, h: height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * (id % col),
            y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
        },
        size,
    };
};
exports.sequenceRect = sequenceRect;
function sequencesGridNode(col, scrollY, getSelectableOptions = () => ({}), _sequences = sequence_1.sequences) {
    (0, sequences_node_1.sequencesNode)(_sequences, scrollY, (0, exports.sequenceRect)(col), getSelectableOptions);
}
exports.sequencesGridNode = sequencesGridNode;
