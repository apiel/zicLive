import { clear, drawText, Events } from 'zic_node_ui';
import { currentPatchId, getPatch, savePatchAs, setCurrentPatchId } from '../patch';
import { getSelectedSequence } from '../sequence';
import { color } from '../style';
import kick23 from '../patches/kick23.bak';
import synth from '../patches/synth.bak';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { config } from '../config';
import { RenderOptions } from '../view';
import { renderMessage, withInfo, withSuccess } from '../draw/drawMessage';
import { drawField, drawFieldDual } from '../draw/drawField';
import { rowNext, rowReset } from '../draw/rowNext';
import { drawKeyboard } from '../draw/drawKeyboard';
import { drawSeparator } from '../draw/drawSeparator';

let scrollY = 0;
let lastCurrentPatchId = -1;
let saveAs = '';
const col = config.screen.col;

export async function patchViewBak(options: RenderOptions = {}) {
    cleanSelectableItems();
    clear(color.background);

    const sequence = getSelectedSequence();
    if (!sequence) {
        drawText(`No patch selected`, { x: 10, y: 10 });
        return;
    }

    rowReset();

    const patch = getPatch(currentPatchId);

    if (lastCurrentPatchId !== currentPatchId) {
        scrollY = 0;
        lastCurrentPatchId = currentPatchId;
        saveAs = patch.name;
    }

    drawField(
        `Patch`,
        currentPatchId.toString(),
        rowNext(1),
        {
            edit: (direction) => {
                setCurrentPatchId(currentPatchId + direction);
            },
            steps: [1, 10]
        },
        { scrollY, info: patch.name },
    );

    drawSeparator(patch.engine.name.charAt(0).toUpperCase() + patch.engine.name.slice(1), rowNext(1), {
        scrollY,
        color: color.white,
    });

    switch (patch.engine.name) {
        case 'synth':
            synth(patch, scrollY);
            break;
        case 'midi':
            // TODO #38 preset view for midi
            drawText(`Engine "${patch.engine.name}", patch "${patch.name}"`, { x: 10, y: 10 });
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
            edit: withInfo('Loaded', () => patch.load()),
        },
        {
            edit: withSuccess('Saved', () => patch.save()),
        },
        { scrollY },
    );

    drawField(
        `Save as`,
        saveAs,
        rowNext(col),
        {
            edit: withSuccess('Saved', () => savePatchAs(patch, saveAs)),
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
                return withSuccess('Saved', () => savePatchAs(patch, saveAs))();
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

export async function patchEventHandlerBak(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await patchViewBak();
        return true;
    }
    if (editMode.edit) {
        const updated = await eventEdit(events);
        if (updated) {
            await patchViewBak();
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
            await patchViewBak();
            return true;
        }
    }
    return false;
}
