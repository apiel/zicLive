import { clear, drawText, Events } from 'zic_node_ui';
import { color } from '../style';

export async function sequencerEditView() {
    clear(color.background);
    drawText('SequencerEdit', { x: 10, y: 10 });
}

export async function sequencerEditEventHandler(events: Events) {
    return false;
}
