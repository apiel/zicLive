import { withInfo, withSuccess } from '../../draw/drawMessage';
import { MidiMsg } from '../../midi';
import { menuHandler, menuNode } from '../../nodes/menu.node';
import { currentPatchId, getPatch } from '../../patch';

const menuItems = [
    {
        text: 'Save',
        handler: () => withSuccess('Patch saved', () => getPatch(currentPatchId).save())(),
    },
    {
        text: 'Reload',
        handler: () => withInfo('Patch loaded', () => getPatch(currentPatchId).load())(),
    },
    // save as
    // vs copy / paste
];

export function patchMenu() {
    menuNode(menuItems);
}

export async function patchMenuHandler(midiMsg: MidiMsg) {
    return menuHandler(midiMsg, menuItems);
}
