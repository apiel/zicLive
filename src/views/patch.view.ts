import { clear, drawText, Events } from 'zic_node_ui';
import { getPatch } from '../patch';
import { getSelectedSequence } from '../sequence';
import { color } from '../style';
import { getTrack } from '../track';
import kick23 from '../patches/kick23';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';

export async function patchView() {
    cleanSelectableItems();
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
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await patchView();
        return true;
    }
    if (editMode.edit) {
        const updated = await eventEdit(events);
        if (updated) {
            await patchView();
            return true;
        }
        return false;
    } else {
        const item = eventSelector(events);
        if (item) {
            // if (item.position.x < config.screen.size.w / 2) {
            //     if (item.position.y > config.screen.size.h - 50) {
            //         scrollY -= 50;
            //     } else if (item.position.y < 40 && scrollY < 0) {
            //         scrollY += 50;
            //     }
            // }
            await patchView();
            return true;
        }
    }
    return false;
}
