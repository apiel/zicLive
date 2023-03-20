"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceToggleMidiHandler = exports.sequenceSelectMidiHandler = exports.sequencerController = exports.padBanks = exports.padSeq = void 0;
const zic_node_1 = require("zic_node");
const midi_1 = require("../../midi");
const akaiApcKey25_1 = require("../../midi/akaiApcKey25");
const sequence_1 = require("../../sequence");
const track_1 = require("../../track");
const sequencer_view_1 = require("../sequencer.view");
// prettier-ignore
exports.padSeq = [
    0x20, 0x21, 0x22, 0x23, 0x24, 0x25,
    0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,
    0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05,
];
// prettier-ignore
exports.padBanks = [
    0x26, 0x27,
    0x1e, 0x1f,
    0x16, 0x17,
    0x0e, 0x0f,
    0x06, 0x07,
];
function sequencerController() {
    if (midi_1.midiOutController?.port) {
        for (let i = 0; i < 30; i++) {
            const { trackId, playing } = sequence_1.sequences[i];
            if (trackId !== undefined) {
                const { padColor } = (0, track_1.getTrackStyle)(trackId);
                // TODO if pad seq still playing but will end, then it should be blink quickly
                // if pad will start to play next, then it should be blink/pulse slowly?
                const padMode = playing ? akaiApcKey25_1.akaiApcKey25.padMode.pulsing1_4 : akaiApcKey25_1.akaiApcKey25.padMode.on100pct;
                (0, zic_node_1.sendMidiMessage)(midi_1.midiOutController.port, [padMode, exports.padSeq[i], padColor]);
            }
            else {
                (0, zic_node_1.sendMidiMessage)(midi_1.midiOutController.port, [akaiApcKey25_1.akaiApcKey25.padMode.on100pct, exports.padSeq[i], 0x00]);
            }
        }
        // TODO
        // FIXME
        exports.padBanks.forEach((pad, i) => {
            (0, zic_node_1.sendMidiMessage)(midi_1.midiOutController.port, [akaiApcKey25_1.akaiApcKey25.padMode.on100pct, pad, 0x00]);
        });
    }
}
exports.sequencerController = sequencerController;
function sequenceSelectMidiHandler(midiMsg, viewPadPressed) {
    if (viewPadPressed && midiMsg.isController) {
        const [type, padKey] = midiMsg.message;
        if (type === midi_1.MIDI_TYPE.KEY_RELEASED) {
            const seqId = exports.padSeq.indexOf(padKey);
            if (seqId !== -1) {
                (0, sequence_1.setSelectedSequenceId)(seqId);
                return true;
            }
        }
    }
    return false;
}
exports.sequenceSelectMidiHandler = sequenceSelectMidiHandler;
async function sequenceToggleMidiHandler({ isController, message: [type, padKey] }) {
    if (isController && type === midi_1.MIDI_TYPE.KEY_RELEASED) {
        const seqId = exports.padSeq.indexOf(padKey);
        if (seqId !== -1) {
            const sequence = (0, sequence_1.getSequence)(seqId);
            if (sequence) {
                (0, sequence_1.toggleSequence)(sequence);
                await (0, sequencer_view_1.sequencerView)({ controllerRendering: true });
                return true;
            }
        }
    }
    return false;
}
exports.sequenceToggleMidiHandler = sequenceToggleMidiHandler;
