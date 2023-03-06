import { getMidiDevices, MidiError, MidiMessage, setMidiCallback, subscribeMidiInput } from 'zic_node';
import { Events, render } from 'zic_node_ui';
import { drawError, renderMessage } from '../draw/drawMessage';
import { KEY_DOWN, KEY_EDIT, KEY_LEFT, KEY_MENU, KEY_RIGHT, KEY_UP } from '../events';
import { viewEventHandler } from '../view';
import { akaiApcKey25 } from './akaiApcKey25';

enum MIDI_TYPE {
    KEY_PRESSED = 144,
    KEY_RELEASED = 128,
}

const events: Events = {
    keysDown: [],
    keysUp: [],
};

const midiDevices = getMidiDevices();
const midiInputController = midiDevices.input.find((input) => input.name.includes('APC Key 25 mk2 C'));
const midiInputKeyboard = midiDevices.input.find((input) => input.name.includes('APC Key 25 mk2 K'));

async function basicUiEvent({ port, message: [type, padKey] }: MidiMessage) {
    // clear keysUp but not keysDown
    events.keysUp = [];
    if (type === MIDI_TYPE.KEY_PRESSED) {
        // pressed
        if (port === midiInputController?.port) {
            if (padKey === akaiApcKey25.pad.up) {
                events.keysDown!.push(KEY_UP);
            } else if (padKey === akaiApcKey25.pad.down) {
                events.keysDown!.push(KEY_DOWN);
            } else if (padKey === akaiApcKey25.pad.left) {
                events.keysDown!.push(KEY_LEFT);
            } else if (padKey === akaiApcKey25.pad.right) {
                events.keysDown!.push(KEY_RIGHT);
            } else if (padKey === akaiApcKey25.pad.volume) {
                events.keysDown!.push(KEY_MENU);
            } else if (padKey === akaiApcKey25.pad.pan) {
                events.keysDown!.push(KEY_EDIT);
            }
        }
    } else if (type === MIDI_TYPE.KEY_RELEASED) {
        // released
        if (port === midiInputController?.port) {
            if (padKey === akaiApcKey25.pad.up) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_UP);
                events.keysUp.push(KEY_UP);
            } else if (padKey === akaiApcKey25.pad.down) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_DOWN);
                events.keysUp.push(KEY_DOWN);
            } else if (padKey === akaiApcKey25.pad.left) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_LEFT);
                events.keysUp.push(KEY_LEFT);
            } else if (padKey === akaiApcKey25.pad.right) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_RIGHT);
                events.keysUp.push(KEY_RIGHT);
            } else if (padKey === akaiApcKey25.pad.volume) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_MENU);
                events.keysUp.push(KEY_MENU);
            } else if (padKey === akaiApcKey25.pad.pan) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_EDIT);
                events.keysUp.push(KEY_EDIT);
            }
        }
    }

    const isUiEvent = events.keysDown?.length || events.keysUp.length;
    try {
        if (isUiEvent) {
            if (await viewEventHandler(events)) {
                render();
            }
        }
    } catch (error) {
        console.error(error);
        drawError((error as any).message);
        renderMessage();
        render();
    }

    return isUiEvent;
}

setMidiCallback(async (data) => {
    if ((data as MidiError).error) {
        console.error('midi error', data);
        return;
    }
    if (await basicUiEvent(data as MidiMessage)) {
        return;
    }
});

midiDevices.input.forEach((input) => {
    if (input.name.startsWith('APC Key 25')) {
        subscribeMidiInput(input.port);
    }
});
