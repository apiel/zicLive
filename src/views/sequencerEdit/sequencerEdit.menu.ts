import { withInfo, withSuccess } from '../../draw/drawMessage';
import { MidiMsg } from '../../midi';
import { getSelectedSequence, getSelectedSequenceId, loadSequence, saveSequence } from '../../sequence';
import { menuHandler, menuNode } from '../../nodes/menu.node';

const menuItems = [
    {
        text: 'Save',
        // FIXME to:
        // handler: withSuccess('Sequences saved', () => saveSequence(getSelectedSequence())),
        handler: () => withSuccess('Sequences saved', () => saveSequence(getSelectedSequence()))(),
    },
    {
        text: 'Reload',
        handler: () => withInfo('Sequence loaded', () => loadSequence(getSelectedSequenceId()))(),
    },
    // save as
    // vs copy / paste
];

export function sequencerMenu() {
    menuNode(menuItems);
}

export async function sequenceMenuHandler(midiMsg: MidiMsg) {
    return menuHandler(midiMsg, menuItems);
}
