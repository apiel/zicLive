import { clear, drawText } from 'zic_node_ui';
import { color } from '../style';
export async function patchView() {
    clear(color.background);
    drawText('Preset', { x: 10, y: 10 });
}
export async function patchEventHandler(events) {
    return false;
}
