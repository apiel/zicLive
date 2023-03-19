import { drawFilledRect, drawRect, drawText, setColor } from 'zic_node_ui';
import { config } from '../config';
import { MidiMsg, MIDI_TYPE } from '../midi';
import { color, font } from '../style';
import { minmax } from '../util';

let showMenu = false;
let selection = 0;
let debounceTime = 0;

const rowSpacing = 30;
const debounce = 250;
const menuItems = ['Save', 'Reload'];

export function sequencerMenuNode() {
    if (showMenu) {
        const rect = {
            position: { x: 40, y: 40 },
            size: { w: config.screen.size.w - 80, h: config.screen.size.h - 80 },
        };
        setColor(color.foreground);
        drawFilledRect(rect);
        setColor(color.foreground3);
        drawRect(rect);

        for (let i = 0; i < menuItems.length; i++) {
            const position = { x: rect.position.x + 20, y: rect.position.y + 10 + rowSpacing * i };
            drawText(menuItems[i], position, { size: 16, font: font.regular, color: color.info });
        }

        const selectRect = {
            position: { x: rect.position.x + 10, y: rect.position.y + 7 + rowSpacing * selection },
            size: { w: rect.size.w - 20, h: 25 },
        };
        drawRect(selectRect);
    }
}

export function sequenceMenuHandler(midiMsg: MidiMsg) {
    if (midiMsg.isController) {
        if (midiMsg.message[0] === MIDI_TYPE.KEY_RELEASED) {
            showMenu = !showMenu;
            selection = 0;
            return true;
        } else if (showMenu) {
            if (midiMsg.message[0] === MIDI_TYPE.CC) {
                if (Date.now() > debounceTime + debounce) {
                    debounceTime = Date.now();
                    const value = midiMsg.message[2];
                    const direction = value < 63 ? value : -(128 - value);
                    selection = minmax(selection + direction, 0, menuItems.length - 1);
                    return true;
                }
            }
            return;
        }
    }
    return false;
}
