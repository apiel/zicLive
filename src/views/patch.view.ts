import { clear, drawText, Events } from 'zic_node_ui';
import { getPatch, loadPatchId, savePatch, savePatchAs } from '../patch';
import { getSelectedSequence } from '../sequence';
import { color } from '../style';
import { getTrack } from '../track';
import kick23 from '../patches/kick23';
import synth from '../patches/synth';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { config } from '../config';
import { RenderOptions } from '../view';
import { renderMessage, withInfo, withSuccess } from '../draw/drawMessage';
import { drawField, drawFieldDual } from '../draw/drawField';
import { rowNext } from '../draw/rowNext';
import { drawKeyboard } from '../draw/drawKeyboard';

let scrollY = 0;
let currentPatchId = -1;
let saveAs = '';
const col = config.screen.col;

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
        saveAs = patch.name;
    }

    switch (engine) {
        case 'synth':
            synth(patch, scrollY);
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


    drawFieldDual(
        ``,
        `Reload`,
        `Save`,
        rowNext(1),
        {
            edit: withInfo('Loaded', () => loadPatchId('kick23', patch.id)),
        },
        {
            edit: withSuccess('Saved', () => savePatch('kick23', patch.id)),
        },
        { scrollY },
    );

    drawField(
        `Save as`,
        saveAs,
        rowNext(col),
        {
            edit: withSuccess('Saved', () => savePatchAs('kick23', patch, saveAs)),
        },
        {
            col,
            scrollY,
        },
    );

    drawKeyboard(
        (char) => {
            if (char === 'DEL') {
                saveAs = saveAs.slice(0, -1);
            } else if (char === 'DONE') {
                return withSuccess('Saved', () => savePatchAs('kick23', patch, saveAs))();
            } else {
                if (saveAs.length < 10) {
                    saveAs += char;
                }
            }
        },
        { row: rowNext(1), col, scrollY, done: 'SAVE' },
    );

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
