import { drawFilledRect, drawRect, drawText, setColor } from 'zic_node_ui';
import { config } from '../config';
import { MidiMsg, MIDI_TYPE } from '../midi';
import { akaiApcKey25 } from '../midi/akaiApcKey25';
import { color, font } from '../style';
import { minmax } from '../util';

interface MenuItem {
    text: string;
    handler: () => Promise<void>;
}

let showMenu = false;
let selection = 0;
let debounceTime = 0;

const rowSpacing = 30;
const debounce = 250;

export function menuNode(menuItems: MenuItem[]) {
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
            drawText(menuItems[i].text, position, { size: 16, font: font.regular, color: color.info });
        }

        const selectRect = {
            position: { x: rect.position.x + 10, y: rect.position.y + 7 + rowSpacing * selection },
            size: { w: rect.size.w - 20, h: 25 },
        };
        drawRect(selectRect);
    }
}

export async function menuHandler(midiMsg: MidiMsg, menuItems: MenuItem[]) {
    if (midiMsg.isController) {
        const [type, key, value] = midiMsg.message;
        if (key === akaiApcKey25.pad.record && type === MIDI_TYPE.KEY_RELEASED) {
            showMenu = !showMenu;
            selection = 0;
            return true;
        } else if (showMenu) {
            if (key === akaiApcKey25.pad.play && type === MIDI_TYPE.KEY_RELEASED) {
                await menuItems[selection].handler();
                showMenu = false;
                return true;
            } else if (type === MIDI_TYPE.CC) {
                if (Date.now() > debounceTime + debounce) {
                    debounceTime = Date.now();
                    const direction = value < 63 ? value : -(128 - value);
                    selection = minmax(selection + direction, 0, menuItems.length - 1);
                    return true;
                }
            } else if (type === MIDI_TYPE.KEY_RELEASED) {
                if (key === akaiApcKey25.pad.up) {
                    selection = minmax(selection - 1, 0, menuItems.length - 1);
                    return true;
                } else if (key === akaiApcKey25.pad.down) {
                    selection = minmax(selection + 1, 0, menuItems.length - 1);
                    return true;
                }
            }
            return;
        }
    }
    return false;
}
