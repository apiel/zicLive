"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewMidiHandler = exports.viewPadPressed = exports.viewEventHandler = exports.renderView = exports.setView = exports.getView = void 0;
const events_1 = require("./events");
const master_view_1 = require("./views/master.view");
const patch_view_1 = require("./views/patch.view");
const sequencer_view_1 = require("./views/sequencer.view");
const sequencerEdit_view_1 = require("./views/sequencerEdit.view");
const def_1 = require("./def");
const midi_1 = require("./midi");
const akaiApcKey25_1 = require("./midi/akaiApcKey25");
const sequencerPattern_view_1 = require("./views/sequencerPattern.view");
let view = def_1.View.Sequencer;
const getView = () => view;
exports.getView = getView;
const setView = (newView) => {
    if (view === newView) {
        return false;
    }
    view = newView;
    return true;
};
exports.setView = setView;
const renderView = (options = {}) => {
    switch (view) {
        case def_1.View.Sequencer:
            return (0, sequencer_view_1.sequencerView)(options);
        case def_1.View.SequencerEdit:
            return (0, sequencerEdit_view_1.sequencerEditView)(options);
        case def_1.View.SequencerPattern:
            return (0, sequencerPattern_view_1.sequencerPatternView)(options);
        case def_1.View.Patch:
            return (0, patch_view_1.patchView)(options);
        case def_1.View.Master:
            return (0, master_view_1.masterView)(options);
    }
    return (0, sequencer_view_1.sequencerView)(options);
};
exports.renderView = renderView;
const viewEventHandler = async (events) => {
    if ((0, events_1.eventMenu)(events)) {
        await (0, exports.renderView)({ controllerRendering: true });
        return true;
    }
    switch (view) {
        case def_1.View.Patch:
            return (0, patch_view_1.patchEventHandler)(events);
        case def_1.View.Master:
            return (0, master_view_1.masterEventHandler)(events);
    }
};
exports.viewEventHandler = viewEventHandler;
exports.viewPadPressed = false;
async function viewMidiHandler(midiMsg) {
    if (midiMsg.isController) {
        switch (midiMsg.message[1]) {
            case akaiApcKey25_1.akaiApcKey25.pad.stopAllClips:
                (0, exports.setView)(def_1.View.Sequencer);
                return true;
            case akaiApcKey25_1.akaiApcKey25.pad.select:
                exports.viewPadPressed = midiMsg.message[0] === midi_1.MIDI_TYPE.KEY_PRESSED;
                (0, exports.setView)(def_1.View.SequencerEdit);
                return true;
            case akaiApcKey25_1.akaiApcKey25.pad.recArm:
                exports.viewPadPressed = midiMsg.message[0] === midi_1.MIDI_TYPE.KEY_PRESSED;
                (0, exports.setView)(def_1.View.SequencerPattern);
                return true;
        }
    }
    switch (view) {
        case def_1.View.Sequencer:
            return (0, sequencer_view_1.sequencerMidiHandler)(midiMsg);
        case def_1.View.SequencerEdit:
            return (0, sequencerEdit_view_1.sequencerEditMidiHandler)(midiMsg, exports.viewPadPressed);
        case def_1.View.SequencerPattern:
            return (0, sequencerPattern_view_1.sequencerPatternMidiHandler)(midiMsg, exports.viewPadPressed);
        // case View.Patch:
        //     return patchMidiHandler(midiMsg);
        // case View.Master:
        //     return masterMidiHandler(midiMsg);
    }
}
exports.viewMidiHandler = viewMidiHandler;
