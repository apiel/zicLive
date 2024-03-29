"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanPadMatrix = exports.handleMidi = exports.shiftPressed = exports.midiOutController = exports.MIDI_TYPE = void 0;
const zic_node_1 = require("zic_node");
const zic_node_ui_1 = require("zic_node_ui");
const drawMessage_1 = require("../draw/drawMessage");
const events_1 = require("../events");
const tcp_1 = require("../tcp");
const view_1 = require("../view");
const akaiApcKey25_1 = require("./akaiApcKey25");
var MIDI_TYPE;
(function (MIDI_TYPE) {
    MIDI_TYPE[MIDI_TYPE["KEY_PRESSED"] = 144] = "KEY_PRESSED";
    MIDI_TYPE[MIDI_TYPE["KEY_RELEASED"] = 128] = "KEY_RELEASED";
    MIDI_TYPE[MIDI_TYPE["CC"] = 176] = "CC";
})(MIDI_TYPE = exports.MIDI_TYPE || (exports.MIDI_TYPE = {}));
const events = {
    keysDown: [],
    keysUp: [],
};
const midiDevices = (0, zic_node_1.getMidiDevices)();
const midiInputController = midiDevices.input.find((input) => input.name.includes('APC Key 25 mk2 C'));
const midiInputKeyboard = midiDevices.input.find((input) => input.name.includes('APC Key 25 mk2 K'));
exports.midiOutController = midiDevices.input.find((input) => input.name.includes('APC Key 25 mk2 C'));
async function basicUiEvent({ isController, message: [type, padKey] }) {
    // clear keysUp but not keysDown
    events.keysUp = [];
    if (type === MIDI_TYPE.KEY_PRESSED) {
        // pressed
        if (isController) {
            if (padKey === akaiApcKey25_1.akaiApcKey25.pad.up) {
                events.keysDown.push(events_1.KEY_UP);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.down) {
                events.keysDown.push(events_1.KEY_DOWN);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.left) {
                events.keysDown.push(events_1.KEY_LEFT);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.right) {
                events.keysDown.push(events_1.KEY_RIGHT);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.volume) {
                events.keysDown.push(events_1.KEY_MENU);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.pan) {
                events.keysDown.push(events_1.KEY_EDIT);
            }
        }
    }
    else if (type === MIDI_TYPE.KEY_RELEASED) {
        // released
        if (isController) {
            if (padKey === akaiApcKey25_1.akaiApcKey25.pad.up) {
                events.keysDown = events.keysDown.filter((key) => key !== events_1.KEY_UP);
                events.keysUp.push(events_1.KEY_UP);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.down) {
                events.keysDown = events.keysDown.filter((key) => key !== events_1.KEY_DOWN);
                events.keysUp.push(events_1.KEY_DOWN);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.left) {
                events.keysDown = events.keysDown.filter((key) => key !== events_1.KEY_LEFT);
                events.keysUp.push(events_1.KEY_LEFT);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.right) {
                events.keysDown = events.keysDown.filter((key) => key !== events_1.KEY_RIGHT);
                events.keysUp.push(events_1.KEY_RIGHT);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.volume) {
                events.keysDown = events.keysDown.filter((key) => key !== events_1.KEY_MENU);
                events.keysUp.push(events_1.KEY_MENU);
            }
            else if (padKey === akaiApcKey25_1.akaiApcKey25.pad.pan) {
                events.keysDown = events.keysDown.filter((key) => key !== events_1.KEY_EDIT);
                events.keysUp.push(events_1.KEY_EDIT);
            }
        }
    }
    const isUiEvent = events.keysDown?.length || events.keysUp.length;
    try {
        if (isUiEvent) {
            if (await (0, view_1.viewEventHandler)(events)) {
                (0, zic_node_ui_1.render)();
            }
        }
    }
    catch (error) {
        console.error(error);
        (0, drawMessage_1.drawError)(error.message);
        (0, drawMessage_1.renderMessage)();
        (0, zic_node_ui_1.render)();
    }
    return isUiEvent;
}
exports.shiftPressed = false;
async function handleMidi(data) {
    (0, tcp_1.sendTcpMidi)(data);
    if (data.isController && data.message[1] === akaiApcKey25_1.akaiApcKey25.pad.shift) {
        const type = data.message[0];
        if (type === MIDI_TYPE.KEY_PRESSED) {
            exports.shiftPressed = true;
        }
        else if (type === MIDI_TYPE.KEY_RELEASED) {
            exports.shiftPressed = false;
        } // else it's a CC
    }
    if (await (0, view_1.viewMidiHandler)(data)) {
        (0, view_1.renderView)({ controllerRendering: true });
        return;
    }
    console.log(data);
    if (await basicUiEvent(data)) {
        return;
    }
}
exports.handleMidi = handleMidi;
(0, zic_node_1.setMidiCallback)(async (data) => {
    // console.log('setMidiCallback', data);
    if (data.error) {
        console.error('midi error', data);
        return;
    }
    const midiMsg = data;
    if (data.port === midiInputController?.port) {
        midiMsg.isController = true;
    }
    else if (data.port === midiInputKeyboard?.port) {
        midiMsg.isKeyboard = true;
    }
    else {
        return;
    }
    await handleMidi(midiMsg);
});
midiDevices.input.forEach((input) => {
    if (input.name.startsWith('APC Key 25')) {
        (0, zic_node_1.subscribeMidiInput)(input.port);
    }
});
function cleanPadMatrix() {
    if (exports.midiOutController !== undefined) {
        akaiApcKey25_1.akaiApcKey25.padMatrixFlat.forEach((pad) => {
            (0, zic_node_1.sendMidiMessage)(exports.midiOutController.port, [akaiApcKey25_1.akaiApcKey25.padMode.on100pct, pad, 0]);
        });
    }
}
exports.cleanPadMatrix = cleanPadMatrix;
// if (midiOutController !== undefined) {
//     for (let i = 0; i < 40; i++) {
//         sendMidiMessage(midiOutController.port, [0x96, 0x00 + i, 0 + i]);
//     }
// }
