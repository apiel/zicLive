import { clear, drawText, Events } from 'zic_node_ui';
import { color } from '../style';

export async function sequencerView() {
    clear(color.background);
    drawText('Sequencer', { x: 10, y: 10 });
}

export async function sequencerEventHandler(events: Events) {
    return false;
}
