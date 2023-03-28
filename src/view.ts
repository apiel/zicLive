import { Events } from 'zic_node_ui';
import { eventMenu } from './events';
import { masterEventHandler, masterView } from './views/master.view';
import { patchMidiHandler, patchView } from './views/patch.view';
import { sequencerMidiHandler, sequencerView } from './views/sequencer.view';
import { sequencerEditMidiHandler, sequencerEditView } from './views/sequencerEdit.view';
import { View } from './def';
import { MidiMsg, MIDI_TYPE } from './midi';
import { akaiApcKey25 } from './midi/akaiApcKey25';
import { patchEventHandlerBak, patchViewBak } from './views/patch2.view';

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
    controllerRendering?: boolean;
}

export const renderView = (options: RenderOptions = {}) => {
    switch (view) {
        case View.Sequencer:
            return sequencerView(options);
        case View.SequencerEdit:
            return sequencerEditView(options);
        case View.Patch:
            return patchView(options);
        case View.PatchBak:
            return patchViewBak(options);
        case View.Master:
            return masterView(options);
    }
    // Set view to sequencer if view is not found
    setView(View.Sequencer);
};

export const viewEventHandler = async (events: Events) => {
    if (eventMenu(events)) {
        await renderView({ controllerRendering: true });
        return true;
    }
    switch (view) {
        case View.PatchBak:
            return patchEventHandlerBak(events);
        case View.Master:
            return masterEventHandler(events);
    }
};

export let viewPadPressed = false;
export async function viewMidiHandler(midiMsg: MidiMsg) {
    if (midiMsg.isController) {
        switch (midiMsg.message[1]) {
            case akaiApcKey25.pad.stopAllClips:
                setView(View.Sequencer);
                return true;
            case akaiApcKey25.pad.select:
                viewPadPressed = midiMsg.message[0] === MIDI_TYPE.KEY_PRESSED;
                setView(View.SequencerEdit);
                return true;
            case akaiApcKey25.pad.recArm:
                viewPadPressed = midiMsg.message[0] === MIDI_TYPE.KEY_PRESSED;
                setView(View.Patch);
                return true;
            case akaiApcKey25.pad.mute:
                viewPadPressed = midiMsg.message[0] === MIDI_TYPE.KEY_PRESSED;
                setView(View.Master);
                return true;
        }
    }

    switch (view) {
        case View.Sequencer:
            return sequencerMidiHandler(midiMsg);
        case View.SequencerEdit:
            return sequencerEditMidiHandler(midiMsg);
        case View.Patch:
            return patchMidiHandler(midiMsg);
        // case View.Master:
        //     return masterMidiHandler(midiMsg);
    }
}
