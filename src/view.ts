import { Events } from 'zic_node_ui';
import { eventMenu } from './events';
import { helpEventHandler, helpView } from './views/help.view';
import { masterEventHandler, masterView } from './views/master.view';
import { patternEventHandler, patternView } from './views/pattern.view';
import { patchEventHandler, patchView } from './views/patch.view';
import { projectEventHandler, projectView } from './views/project.view';
import { sequencerEventHandler, sequencerView } from './views/sequencer.view';
import { sequencerEditEventHandler, sequencerEditView } from './views/sequencerEdit.view';

export enum View {
    Sequencer,
    SequencerEdit,
    Pattern,
    Preset, // Patch preset (patch connot be changed as they done programmatically, but setting of the patch can be saved as preset)
    Master, // Master Volume, Tempo, FX, etc... (mixer?, scatter?)
    Project,
    Help,
}

let view: View = View.Sequencer;

export const getView = () => view;

export const setView = (newView: View) => {
    view = newView;
    return true;
};

export const renderView = () => {
    switch (view) {
        case View.Sequencer:
            return sequencerView();
        case View.SequencerEdit:
            return sequencerEditView();
        case View.Pattern:
            return patternView();
        case View.Preset:
            return patchView();
        case View.Master:
            return masterView();
        case View.Project:
            return projectView();
        case View.Help:
            return helpView();
    }
    return sequencerView();
};

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
            return patchEventHandler(events);
        case View.Master:
            return masterEventHandler(events);
        case View.Project:
            return projectEventHandler(events);
        case View.Help:
            return helpEventHandler(events);
    }
};
