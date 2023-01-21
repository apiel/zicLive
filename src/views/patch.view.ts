import { clear, drawText, Events } from 'zic_node_ui';
import { getPatch } from '../patch';
import { getSelectedSequence } from '../sequence';
import { color } from '../style';
import { getTrack } from '../track';
import kick23 from '../patches/kick23';

export async function patchView() {
    clear(color.background);

    const { trackId, patchId } = getSelectedSequence();
    const { engine } = getTrack(trackId);
    const patch = getPatch(engine, patchId);

    switch (engine) {
        case 'zicSynth':
            drawText(`Engine "${engine}", patch "${patch.name}"`, { x: 10, y: 10 });
            break;
        case 'PD':
            drawText(`Engine "${engine}", patch "${patch.name}"`, { x: 10, y: 10 });
            break;
        case 'midi':
            drawText(`Engine "${engine}", patch "${patch.name}"`, { x: 10, y: 10 });
            break;
        case 'kick23':
            kick23();
            break;
    }
}

export async function patchEventHandler(events: Events) {
    return false;
}
