import { Events } from 'zic_node_ui';
import { eventMenu } from './events';
import { helpEventHandler, helpView } from './views/help.view';
import { masterEventHandler, masterView } from './views/master.view';
import { patternEventHandler, patternView } from './views/pattern.view';
import { patchEventHandler, patchView } from './views/patch.view';
import { sequencerEventHandler, sequencerView } from './views/sequencer.view';
import { sequencerEditEventHandler, sequencerEditView } from './views/sequencerEdit.view';
import { View } from './def';
import { renderMessage } from './draw/drawMessage';

let view: View = View.Sequencer;

export const getView = () => view;

export const setView = (newView: View) => {
    view = newView;
    return true;
};

function _renderView() {
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
        case View.Help:
            return helpView();
    }
    return sequencerView();
}

export const renderView = async () => {
    await _renderView();
    renderMessage();
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
        case View.Help:
            return helpEventHandler(events);
    }
};
