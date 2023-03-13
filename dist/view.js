"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewEventHandler = exports.renderView = exports.setView = exports.getView = void 0;
const events_1 = require("./events");
const help_view_1 = require("./views/help.view");
const master_view_1 = require("./views/master.view");
const patch_view_1 = require("./views/patch.view");
const sequencer_view_1 = require("./views/sequencer.view");
const sequencerEdit_view_1 = require("./views/sequencerEdit.view");
const def_1 = require("./def");
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
        case def_1.View.Patch:
            return (0, patch_view_1.patchView)(options);
        case def_1.View.Master:
            return (0, master_view_1.masterView)(options);
        case def_1.View.Help:
            return (0, help_view_1.helpView)(options);
    }
    return (0, sequencer_view_1.sequencerView)(options);
};
exports.renderView = renderView;
const viewEventHandler = async (events) => {
    if ((0, events_1.eventMenu)(events)) {
        await (0, exports.renderView)();
        return true;
    }
    switch (view) {
        case def_1.View.Sequencer:
            return (0, sequencer_view_1.sequencerEventHandler)(events);
        case def_1.View.SequencerEdit:
            return (0, sequencerEdit_view_1.sequencerEditEventHandler)(events);
        case def_1.View.Patch:
            return (0, patch_view_1.patchEventHandler)(events);
        case def_1.View.Master:
            return (0, master_view_1.masterEventHandler)(events);
        case def_1.View.Help:
            return (0, help_view_1.helpEventHandler)(events);
    }
};
exports.viewEventHandler = viewEventHandler;
