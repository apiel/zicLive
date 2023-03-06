import { getMidiDevices, MidiError, MidiMessage, setMidiCallback, subscribeMidiInput } from 'zic_node';
import { Events, render } from 'zic_node_ui';
import { drawError, renderMessage } from '../draw/drawMessage';
import { KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP } from '../events';
import { viewEventHandler } from '../view';
import { akaiApcKey25 } from './akaiApcKey25';

const events: Events = {
    keysDown: [],
    keysUp: [],
};

const midiDevices = getMidiDevices();
const midiInputController = midiDevices.input.find((input) => input.name.includes('APC Key 25 mk2 C'));
const midiInputKeyboard = midiDevices.input.find((input) => input.name.includes('APC Key 25 mk2 K'));

setMidiCallback(async (data) => {
    if ((data as MidiError).error) {
        console.error('midi error', data);
        return;
    }
    const { port, message } = data as MidiMessage;
    // clear keysUp but not keysDown
    events.keysUp = [];
    if (message[0] === 144) {
        // pressed
        if (port === midiInputController?.port) {
            if (message[1] === akaiApcKey25.pad.up) {
                events.keysDown!.push(KEY_UP);
            } else if (message[1] === akaiApcKey25.pad.down) {
                events.keysDown!.push(KEY_DOWN);
            } else if (message[1] === akaiApcKey25.pad.left) {
                events.keysDown!.push(KEY_LEFT);
            } else if (message[1] === akaiApcKey25.pad.right) {
                events.keysDown!.push(KEY_RIGHT);
            }
        }
    } else if (message[0] === 128) {
        // released
        if (port === midiInputController?.port) {
            if (message[1] === akaiApcKey25.pad.up) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_UP);
                events.keysUp.push(KEY_UP);
            } else if (message[1] === akaiApcKey25.pad.down) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_DOWN);
                events.keysUp.push(KEY_DOWN);
            } else if (message[1] === akaiApcKey25.pad.left) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_LEFT);
                events.keysUp.push(KEY_LEFT);
            } else if (message[1] === akaiApcKey25.pad.right) {
                events.keysDown = events.keysDown!.filter((key) => key !== KEY_RIGHT);
                events.keysUp.push(KEY_RIGHT);
            }
        }
    }

    try {
        if (events.keysDown?.length || events.keysUp.length) {
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
});

midiDevices.input.forEach((input) => {
    if (input.name.startsWith('APC Key 25')) {
        subscribeMidiInput(input.port);
    }
});
