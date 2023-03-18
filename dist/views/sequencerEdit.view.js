"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencerEditMidiHandler = exports.sequencerEditView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const style_1 = require("../style");
const drawMessage_1 = require("../draw/drawMessage");
const midi_1 = require("../midi");
const sequencerController_1 = require("./controller/sequencerController");
const sequence_1 = require("../sequence");
const track_1 = require("../track");
const patternPreview_node_1 = require("../nodes/patternPreview.node");
const encoder_node_1 = require("../nodes/encoder.node");
const { margin } = style_1.unit;
const sequenceRect = (id) => {
    const size = { w: 25, h: 15 };
    return {
        position: {
            x: margin + (margin + size.w) * (id % config_1.config.sequence.col),
            y: margin + (margin + size.h) * Math.floor(id / config_1.config.sequence.col),
        },
        size,
    };
};
async function sequencerEditView({ controllerRendering } = {}) {
    if (controllerRendering) {
        (0, sequencerController_1.sequencerController)();
    }
    (0, zic_node_ui_1.clear)(style_1.color.background);
    for (let i = 0; i < 30; i++) {
        const rect = sequenceRect(i);
        const { trackId } = sequence_1.sequences[i];
        (0, zic_node_ui_1.setColor)(trackId !== undefined ? (0, track_1.getTrackStyle)(trackId).color : style_1.color.foreground);
        (0, zic_node_ui_1.drawFilledRect)(rect);
        (0, zic_node_ui_1.drawText)(`${i + 1}`.padStart(3, '0'), { x: rect.position.x + 4, y: rect.position.y + 1 }, { color: style_1.color.foreground3, size: 10, font: style_1.font.bold });
        if ((0, sequence_1.getSelectedSequenceId)() === i) {
            // TODO find better selection color
            (0, zic_node_ui_1.setColor)(style_1.color.white);
            (0, zic_node_ui_1.drawRect)(rect);
        }
    }
    const { trackId, stepCount, steps, playing } = (0, sequence_1.getSelectedSequence)();
    if (trackId !== undefined) {
        const patternPreviewPosition = { x: 165, y: margin };
        const patternPreviewRect = {
            position: patternPreviewPosition,
            size: { w: config_1.config.screen.size.w - (patternPreviewPosition.x + margin * 2), h: 83 },
        };
        (0, zic_node_ui_1.setColor)(style_1.color.foreground);
        (0, zic_node_ui_1.drawFilledRect)(patternPreviewRect);
        (0, patternPreview_node_1.patternPreviewNode)(patternPreviewRect, stepCount, steps, playing);
        // if (activeStep !== undefined) {
        //     renderActiveStep(patternPreviewPosition, patternPreviewSize, stepCount, activeStep);
        // }
    }
    (0, encoder_node_1.encoderNode)([
        { title: 'Sequence' },
        null,
        null,
        null,
        { title: 'Track' },
        null,
        null,
        null,
    ]);
    (0, drawMessage_1.renderMessage)();
}
exports.sequencerEditView = sequencerEditView;
async function sequencerEditMidiHandler({ isController, message: [type, padKey] }) {
    if (isController) {
        if (type === midi_1.MIDI_TYPE.KEY_RELEASED) {
            // const seqId = padSeq.indexOf(padKey);
            // if (seqId !== -1) {
            //     const sequence = getSequence(seqId);
            //     if (sequence) {
            //         toggleSequence(sequence);
            //         await sequencerView({ controllerRendering: true });
            //         return true;
            //     }
            // }
        }
    }
    return false;
}
exports.sequencerEditMidiHandler = sequencerEditMidiHandler;
