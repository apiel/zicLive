"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencesRowNode = exports.sequenceRect = exports.height = void 0;
const style_1 = require("../style");
const config_1 = require("../config");
const sequences_node_1 = require("./sequences.node");
const sequence_1 = require("../sequence");
const { margin } = style_1.unit;
exports.height = style_1.unit.height * 2 - 10;
const sequenceWidth = config_1.config.screen.size.w / config_1.config.sequence.col - margin;
function sequenceRect(id, scrollY = 0) {
    const size = { w: sequenceWidth, h: exports.height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * id,
            y: scrollY + margin,
        },
        size,
    };
}
exports.sequenceRect = sequenceRect;
function sequencesRowNode(scrollY, getSelectableOptions = () => ({}), _sequences = sequence_1.sequences, options) {
    (0, sequences_node_1.sequencesNode)(_sequences, scrollY, sequenceRect, getSelectableOptions, options);
}
exports.sequencesRowNode = sequencesRowNode;
