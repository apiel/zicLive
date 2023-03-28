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
];

export function sequencerMenu() {
    menuNode(menuItems);
}

export async function sequenceMenuHandler(midiMsg: MidiMsg) {
    return menuHandler(midiMsg, menuItems);
}
