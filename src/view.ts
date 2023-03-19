import { Events } from 'zic_node_ui';
import { eventMenu } from './events';
import { masterEventHandler, masterView } from './views/master.view';
import { patchEventHandler, patchView } from './views/patch.view';
import { sequencerMidiHandler, sequencerView } from './views/sequencer.view';
import { sequencerEditMidiHandler, sequencerEditView } from './views/sequencerEdit.view';
import { View } from './def';
import { MidiMsg, MIDI_TYPE } from './midi';
import { akaiApcKey25 } from './midi/akaiApcKey25';
import { sequencerPatternMidiHandler, sequencerPatternView } from './views/sequencerPattern.view';

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
        case View.SequencerPattern:
            return sequencerPatternView(options);
        case View.Patch:
            return patchView(options);
        case View.Master:
            return masterView(options);
    }
    return sequencerView(options);
};

export const viewEventHandler = async (events: Events) => {
    if (eventMenu(events)) {
        await renderView({ controllerRendering: true });
        return true;
    }
    switch (view) {
        case View.Patch:
            return patchEventHandler(events);
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
                setView(View.SequencerPattern);
                return true;
        }
    }

    switch (view) {
        case View.Sequencer:
            return sequencerMidiHandler(midiMsg);
        case View.SequencerEdit:
            return sequencerEditMidiHandler(midiMsg, viewPadPressed);
        case View.SequencerPattern:
            return sequencerPatternMidiHandler(midiMsg, viewPadPressed);
        // case View.Patch:
        //     return patchMidiHandler(midiMsg);
        // case View.Master:
        //     return masterMidiHandler(midiMsg);
    }
}
