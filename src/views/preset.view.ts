import { clear, drawText, Events } from 'zic_node_ui';
import { color } from '../style';

export async function presetView() {
    clear(color.background);
    drawText('Preset', { x: 10, y: 10 });
}

export async function presetEventHandler(events: Events) {
    return false;
}
