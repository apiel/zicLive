"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodersHandler = exports.encodersView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const style_1 = require("../../style");
const drawMessage_1 = require("../../draw/drawMessage");
const midi_1 = require("../../midi");
const encoder_node_1 = require("../../nodes/encoder.node");
const akaiApcKey25_1 = require("../../midi/akaiApcKey25");
const DEFAULT_DEBOUNCE = 200;
const encoderStates = Object.fromEntries(akaiApcKey25_1.akaiApcKey25.encoderList.map(({ midiKey }, index) => [
    midiKey,
    {
        timing: 0,
        index,
    },
]));
async function encodersView(encoders) {
    (0, zic_node_ui_1.clear)(style_1.color.background);
    for (let i = 0; i < encoders.length; i++) {
        const encoder = encoders[i];
        (0, encoder_node_1.encoderNode)(i, encoder);
    }
    (0, drawMessage_1.renderMessage)();
}
exports.encodersView = encodersView;
function encodersHandler(encoders, { message: [type, key, value] }) {
    if (type === midi_1.MIDI_TYPE.CC) {
        const state = encoderStates[key];
        if (state) {
            const encoder = encoders[state.index];
            if (encoder?.handler) {
                const { debounce = DEFAULT_DEBOUNCE } = encoder;
                if (encoder.debounce === 0 || Date.now() > state.timing + debounce) {
                    state.timing = Date.now();
                    const direction = value < 63 ? value : -(128 - value);
                    return encoder.handler(direction);
                }
            }
        }
    }
    return false;
}
exports.encodersHandler = encodersHandler;
