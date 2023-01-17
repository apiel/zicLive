import { clear, drawText, Events } from 'zic_node_ui';
import { color } from '../style';

export async function masterView() {
    clear(color.background);
    drawText('Master', { x: 10, y: 10 });
}

export async function masterEventHandler(events: Events) {
    return false;
}