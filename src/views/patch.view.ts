import { clear, drawText, Events } from 'zic_node_ui';
import { getPatch } from '../patch';
import { getSelectedSequence } from '../sequence';
import { color } from '../style';
import { getTrack } from '../track';
import kick23, { kick23Init } from '../patches/kick23';
import zicSynth, { zicSynthInit } from '../patches/zicSynth';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { config } from '../config';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';

let scrollY = 0;
let currentPatchId = -1;

export async function patchView(options: RenderOptions = {}) {
    cleanSelectableItems();
    clear(color.background);

    const sequence = getSelectedSequence();
    if (!sequence) {
        drawText(`No patch selected`, { x: 10, y: 10 });
        return;
    }

    const { trackId, patchId } = sequence;
    const { engine } = getTrack(trackId);
    const patch = getPatch(engine, patchId);

    if (currentPatchId !== patchId) {
        scrollY = 0;
        currentPatchId = patchId;
        switch (engine) {
            case 'kick23':
                kick23Init(patch);
                break;
            case 'zicSynth':
                zicSynthInit(patch);
                break;
        }
    }

    switch (engine) {
        case 'zicSynth':
            zicSynth(patch, scrollY);
            break;
        case 'pd':
            // TODO #39 preset view for pd
            drawText(`Engine "${engine}", patch "${patch.name}"`, { x: 10, y: 10 });
            break;
        case 'midi':
            // TODO #38 preset view for midi
            drawText(`Engine "${engine}", patch "${patch.name}"`, { x: 10, y: 10 });
            break;
        case 'kick23':
            kick23(patch, scrollY);
            break;
    }

    renderMessage();
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
            if (item.position.y > config.screen.size.h - 60) {
                scrollY -= 60;
            } else if (item.position.y < 60 && scrollY < 0) {
                scrollY += 60;
            }
            await patchView();
            return true;
        }
    }
    return false;
}
