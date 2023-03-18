"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencerMidiHandler = exports.sequencerView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const style_1 = require("../style");
const sequence_1 = require("../sequence");
const drawMessage_1 = require("../draw/drawMessage");
const track_1 = require("../track");
const sequence_node_1 = require("../nodes/sequence.node");
const midi_1 = require("../midi");
const sequencerController_1 = require("./controller/sequencerController");
const { margin } = style_1.unit;
const height = config_1.config.screen.size.h / config_1.config.sequence.row;
const sequenceWidth = config_1.config.screen.size.w / config_1.config.sequence.col - margin;
const sequenceRect = (id) => {
    const size = { w: sequenceWidth, h: height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * (id % config_1.config.sequence.col),
            y: margin + (margin + size.h) * Math.floor(id / config_1.config.sequence.col),
        },
        size,
    };
};
async function sequencerView({ controllerRendering } = {}) {
    if (controllerRendering) {
        (0, sequencerController_1.sequencerController)();
    }
    (0, zic_node_ui_1.clear)(style_1.color.background);
    for (let i = 0; i < 30; i++) {
        const rect = sequenceRect(i);
        const { id, trackId, nextSequenceId, ...seq } = sequence_1.sequences[i];
        if (trackId !== undefined) {
            let next;
            if (nextSequenceId !== undefined) {
                next = nextSequenceId.toString();
            }
            (0, sequence_node_1.sequenceNode)(id, rect, {
                ...seq,
                trackColor: (0, track_1.getTrackStyle)(trackId).color,
                next,
            });
        }
        else {
            (0, zic_node_ui_1.setColor)(style_1.color.foreground);
            (0, zic_node_ui_1.drawFilledRect)(rect);
        }
    }
    (0, drawMessage_1.renderMessage)();
}
exports.sequencerView = sequencerView;
async function sequencerMidiHandler({ isController, message: [type, padKey] }) {
    if (isController) {
        if (type === midi_1.MIDI_TYPE.KEY_RELEASED) {
            const seqId = sequencerController_1.padSeq.indexOf(padKey);
            if (seqId !== -1) {
                const sequence = (0, sequence_1.getSequence)(seqId);
                if (sequence) {
                    (0, sequence_1.toggleSequence)(sequence);
                    await sequencerView({ controllerRendering: true });
                    return true;
                }
            }
        }
    }
    return false;
}
exports.sequencerMidiHandler = sequencerMidiHandler;
