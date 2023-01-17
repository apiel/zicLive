import { Events } from "zic_node_ui";
import { eventMenu } from "./events";
import { masterEventHandler, masterView } from "./views/master.view";
import { patternEventHandler, patternView } from "./views/pattern.view";
import { presetEventHandler, presetView } from "./views/preset.view";
import { projectEventHandler, projectView } from "./views/project.view";
import { sequencerEventHandler, sequencerView } from "./views/sequencer.view";
import { sequencerEditEventHandler, sequencerEditView } from "./views/sequencerEdit.view";

export enum View {
    Sequencer,
    SequencerEdit,
    Pattern,
    Preset, // Patch preset (patch connot be changed as they done programmatically, but setting of the patch can be saved as preset)
    Master, // Master Volume, Tempo, FX, etc... (mixer?, scatter?)
    Project,
}

// let view: View = View.Sequencer;
let view: View = View.Pattern;

export const getView = () => view;

export const setView = (newView: View) => {
    view = newView;
    return true;
}

export const renderView = () => {
    switch (view) {
        case View.Sequencer:
            return sequencerView();
        case View.SequencerEdit:
            return sequencerEditView();
        case View.Pattern:
            return patternView();
        case View.Preset:
            return presetView();
        case View.Master:
            return masterView();
        case View.Project:
            return projectView();
    }
    return sequencerView();
}

export const viewEventHandler = (events: Events) => {
    if (eventMenu(events)) {
        renderView();
        return true;
    }
    switch (view) {
        case View.Sequencer:
            return sequencerEventHandler(events);
        case View.SequencerEdit:
            return sequencerEditEventHandler(events);
        case View.Pattern:
            return patternEventHandler(events);
        case View.Preset:
            return presetEventHandler(events);
        case View.Master:
            return masterEventHandler(events);
        case View.Project:
            return projectEventHandler(events);
    }
}
