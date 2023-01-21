import { eventMenu } from './events';
import { helpEventHandler, helpView } from './views/help.view';
import { masterEventHandler, masterView } from './views/master.view';
import { patternEventHandler, patternView } from './views/pattern.view';
import { patchEventHandler, patchView } from './views/preset.view';
import { projectEventHandler, projectView } from './views/project.view';
import { sequencerEventHandler, sequencerView } from './views/sequencer.view';
import { sequencerEditEventHandler, sequencerEditView } from './views/sequencerEdit.view';
export var View;
(function (View) {
    View[View["Sequencer"] = 0] = "Sequencer";
    View[View["SequencerEdit"] = 1] = "SequencerEdit";
    View[View["Pattern"] = 2] = "Pattern";
    View[View["Preset"] = 3] = "Preset";
    View[View["Master"] = 4] = "Master";
    View[View["Project"] = 5] = "Project";
    View[View["Help"] = 6] = "Help";
})(View || (View = {}));
let view = View.Sequencer;
export const getView = () => view;
export const setView = (newView) => {
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
export const viewEventHandler = (events) => {
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
