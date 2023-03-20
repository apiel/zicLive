"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceMenuHandler = exports.sequencerMenuNode = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const drawMessage_1 = require("../draw/drawMessage");
const midi_1 = require("../midi");
const akaiApcKey25_1 = require("../midi/akaiApcKey25");
const sequence_1 = require("../sequence");
const style_1 = require("../style");
const util_1 = require("../util");
let showMenu = false;
let selection = 0;
let debounceTime = 0;
const rowSpacing = 30;
const debounce = 250;
const menuItems = [
    {
        text: 'Save',
        // FIXME to: 
        // handler: withSuccess('Sequences saved', () => saveSequence(getSelectedSequence())),
        handler: () => (0, drawMessage_1.withSuccess)('Sequences saved', () => (0, sequence_1.saveSequence)((0, sequence_1.getSelectedSequence)()))(),
    },
    {
        text: 'Reload',
        handler: () => (0, drawMessage_1.withInfo)('Sequence loaded', () => (0, sequence_1.loadSequence)((0, sequence_1.getSelectedSequenceId)()))(),
    },
];
function sequencerMenuNode() {
    if (showMenu) {
        const rect = {
            position: { x: 40, y: 40 },
            size: { w: config_1.config.screen.size.w - 80, h: config_1.config.screen.size.h - 80 },
        };
        (0, zic_node_ui_1.setColor)(style_1.color.foreground);
        (0, zic_node_ui_1.drawFilledRect)(rect);
        (0, zic_node_ui_1.setColor)(style_1.color.foreground3);
        (0, zic_node_ui_1.drawRect)(rect);
        for (let i = 0; i < menuItems.length; i++) {
            const position = { x: rect.position.x + 20, y: rect.position.y + 10 + rowSpacing * i };
            (0, zic_node_ui_1.drawText)(menuItems[i].text, position, { size: 16, font: style_1.font.regular, color: style_1.color.info });
        }
        const selectRect = {
            position: { x: rect.position.x + 10, y: rect.position.y + 7 + rowSpacing * selection },
            size: { w: rect.size.w - 20, h: 25 },
        };
        (0, zic_node_ui_1.drawRect)(selectRect);
    }
}
exports.sequencerMenuNode = sequencerMenuNode;
async function sequenceMenuHandler(midiMsg) {
    if (midiMsg.isController) {
        const [type, key, value] = midiMsg.message;
        if (key === akaiApcKey25_1.akaiApcKey25.pad.record && type === midi_1.MIDI_TYPE.KEY_RELEASED) {
            showMenu = !showMenu;
            selection = 0;
            return true;
        }
        else if (showMenu) {
            if (key === akaiApcKey25_1.akaiApcKey25.pad.play && type === midi_1.MIDI_TYPE.KEY_RELEASED) {
                await menuItems[selection].handler();
                showMenu = false;
                return true;
            }
            else if (type === midi_1.MIDI_TYPE.CC) {
                if (Date.now() > debounceTime + debounce) {
                    debounceTime = Date.now();
                    const direction = value < 63 ? value : -(128 - value);
                    selection = (0, util_1.minmax)(selection + direction, 0, menuItems.length - 1);
                    return true;
                }
            }
            return;
        }
    }
    return false;
}
exports.sequenceMenuHandler = sequenceMenuHandler;
