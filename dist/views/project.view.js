import { clear, drawText } from 'zic_node_ui';
import { color } from '../style';
export async function projectView() {
    clear(color.background);
    drawText('Project', { x: 10, y: 10 });
}
export async function projectEventHandler(events) {
    return false;
}
