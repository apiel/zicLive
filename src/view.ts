import { Events } from 'zic_node_ui';
import { eventMenu } from './events';
import { helpEventHandler, helpView } from './views/help.view';
import { masterEventHandler, masterView } from './views/master.view';
import { patchEventHandler, patchView } from './views/patch.view';
import { sequencerEventHandler, sequencerView } from './views/sequencer.view';
import { sequencerEditEventHandler, sequencerEditView } from './views/sequencerEdit.view';
import { View } from './def';

let view: View = View.Sequencer;

export const getView = () => view;

export const setView = (newView: View) => {
    if (view === newView) {
        return false;
    }
    view = newView;
    return true;
};

export interface RenderOptions {
    beatRendering?: boolean;
}

export const renderView = (options: RenderOptions = {}) => {
    switch (view) {
        case View.Sequencer:
            return sequencerView(options);
        case View.SequencerEdit:
            return sequencerEditView(options);
        case View.Patch:
            return patchView(options);
        case View.Master:
            return masterView(options);
        case View.Help:
            return helpView(options);
    }
    return sequencerView(options);
};

export const viewEventHandler = async (events: Events) => {
    if (eventMenu(events)) {
        await renderView();
        return true;
    }
    switch (view) {
        case View.Sequencer:
            return sequencerEventHandler(events);
        case View.SequencerEdit:
            return sequencerEditEventHandler(events);
        case View.Patch:
            return patchEventHandler(events);
        case View.Master:
            return masterEventHandler(events);
        case View.Help:
            return helpEventHandler(events);
    }
};
