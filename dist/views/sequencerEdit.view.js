"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencerEditMidiHandler = exports.sequencerEditView = exports.sequenceEncoder = void 0;
const drawMessage_1 = require("../draw/drawMessage");
const sequencerController_1 = require("./controller/sequencerController");
const sequence_1 = require("../sequence");
const track_1 = require("../track");
const util_1 = require("../util");
const selector_1 = require("../selector");
const def_1 = require("../def");
const encoders_layout_1 = require("./layout/encoders.layout");
const sequenceEditHeader_node_1 = require("../nodes/sequenceEditHeader.node");
const sequenceMenu_node_1 = require("../nodes/sequenceMenu.node");
exports.sequenceEncoder = {
    title: 'Sequence',
    getValue: () => {
        const { id, trackId } = (0, sequence_1.getSelectedSequence)();
        return {
            value: `#${`${id + 1}`.padStart(3, '0')}`,
            valueColor: trackId === undefined ? undefined : (0, track_1.getTrackStyle)(trackId).color,
        };
    },
    handler: async (direction) => {
        const id = (0, util_1.minmax)((0, sequence_1.getSelectedSequenceId)() + direction, 0, sequence_1.sequences.length - 1);
        (0, sequence_1.setSelectedSequenceId)(id);
        (0, selector_1.forceSelectedItem)(def_1.View.Sequencer, id);
        return true;
    },
};
const encoders = [
    exports.sequenceEncoder,
    {
        title: 'Repeat',
        getValue: () => {
            const { trackId, repeat } = (0, sequence_1.getSelectedSequence)();
            return trackId === undefined ? '' : `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`;
        },
        handler: async (direction) => {
            const sequence = (0, sequence_1.getSelectedSequence)();
            if (sequence.trackId === undefined) {
                return false;
            }
            sequence.repeat = (0, util_1.minmax)(sequence.repeat + direction, 0, 16);
            return true;
        },
    },
    {
        title: 'Next sequence',
        getValue: () => {
            const { trackId, nextSequenceId } = (0, sequence_1.getSelectedSequence)();
            return trackId === undefined ? '' : nextSequenceId ? `#${`${nextSequenceId + 1}`.padStart(3, '0')}` : `---`;
        },
        handler: async (direction) => {
            const sequence = (0, sequence_1.getSelectedSequence)();
            if (sequence.trackId === undefined) {
                return false;
            }
            const selectedId = (0, sequence_1.getSelectedSequenceId)();
            const ids = sequence_1.sequences.filter((s) => s.trackId === sequence.trackId && s.id !== selectedId).map((s) => s.id);
            let idx = sequence.nextSequenceId !== undefined ? ids.indexOf(sequence.nextSequenceId) : -1;
            idx = (0, util_1.minmax)(idx + direction, -1, ids.length - 1);
            sequence.nextSequenceId = idx === -1 ? undefined : ids[idx];
            return true;
        },
    },
    undefined,
    {
        title: 'Track',
        getValue: () => {
            const { trackId } = (0, sequence_1.getSelectedSequence)();
            return trackId === undefined ? 'No track' : (0, track_1.getTrack)(trackId).name;
        },
        handler: async (direction) => {
            // TODO when changing track for a sequence, patch are not valid anymore
            const { trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId !== undefined) {
                const id = direction === -1 && trackId === 0 ? undefined : (0, util_1.minmax)(trackId + direction, 0, (0, track_1.getTrackCount)() - 1);
                sequence_1.sequences[(0, sequence_1.getSelectedSequenceId)()].trackId = id;
            }
            else if (direction === 1) {
                sequence_1.sequences[(0, sequence_1.getSelectedSequenceId)()].trackId = 0;
            }
            return true;
        },
    },
    {
        title: 'Detune',
        getValue: () => {
            const { trackId, detune } = (0, sequence_1.getSelectedSequence)();
            return trackId === undefined ? '' : detune < 0 ? detune.toString() : `+${detune}`;
        },
        unit: 'semitones',
        handler: async (direction) => {
            const sequence = (0, sequence_1.getSelectedSequence)();
            if (sequence.trackId === undefined) {
                return false;
            }
            sequence.detune = (0, util_1.minmax)(sequence.detune + direction, -12, 12);
            return true;
        },
    },
    {
        title: 'Pattern length',
        getValue: () => {
            const { trackId, stepCount } = (0, sequence_1.getSelectedSequence)();
            return trackId === undefined ? '' : `${stepCount}`;
        },
        unit: 'steps',
        handler: async (direction) => {
            const sequence = (0, sequence_1.getSelectedSequence)();
            if (sequence.trackId === undefined) {
                return false;
            }
            sequence.stepCount = (0, util_1.minmax)(sequence.stepCount + direction, 1, 64);
            return true;
        },
    },
    undefined,
];
async function sequencerEditView({ controllerRendering } = {}) {
    if (controllerRendering) {
        (0, sequencerController_1.sequencerController)();
    }
    (0, encoders_layout_1.encodersView)(encoders);
    (0, sequenceEditHeader_node_1.sequenceEditHeader)();
    (0, sequenceMenu_node_1.sequencerMenuNode)();
    (0, drawMessage_1.renderMessage)();
}
exports.sequencerEditView = sequencerEditView;
async function sequencerEditMidiHandler(midiMsg, viewPadPressed) {
    const menuStatus = await (0, sequenceMenu_node_1.sequenceMenuHandler)(midiMsg);
    if (menuStatus !== false) {
        return menuStatus !== undefined;
    }
    if ((0, sequencerController_1.sequenceSelectMidiHandler)(midiMsg, viewPadPressed)) {
        return true;
    }
    if (await (0, sequencerController_1.sequenceToggleMidiHandler)(midiMsg)) {
        return true;
    }
    return (0, encoders_layout_1.encodersHandler)(encoders, midiMsg);
}
exports.sequencerEditMidiHandler = sequencerEditMidiHandler;
