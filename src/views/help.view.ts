import { clear, drawText, Events } from 'zic_node_ui';
import { View } from '../def';
import { renderMessage } from '../draw/drawMessage';
import { drawSelectableText } from '../draw/drawSelectable';
import { eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { color, font } from '../style';
import { RenderOptions, renderView, setView } from '../view';

export async function helpView(options: RenderOptions = {}) {
    cleanSelectableItems();
    clear(color.background);
    drawText('Menu (>1sec) =', { x: 10, y: 10 }, { color: color.info });
    drawSelectableText(
        'Help',
        { x: 150, y: 10 },
        { color: color.white, font: font.bold },
        { edit: () => setView(View.Help) },
    );
    drawText('Menu (<0.5sec) =', { x: 10, y: 30 }, { color: color.info });
    drawSelectableText(
        'Sequencer / Sequencer Edit',
        { x: 165, y: 30 },
        { color: color.white, font: font.bold },
        { edit: () => setView(View.Sequencer) },
    );
    drawText('Menu + Right =', { x: 10, y: 50 }, { color: color.info });
    drawSelectableText(
        'Project',
        { x: 145, y: 50 },
        { color: color.white, font: font.bold },
        { edit: () => setView(View.Project) },
    );
    // drawText('Menu + Down =', { x: 10, y: 70 }, { color: color.info });
    // drawSelectableText(
    //     'Pattern',
    //     { x: 150, y: 70 },
    //     { color: color.white, font: font.bold },
    //     { edit: () => setView(View.Pattern) },
    // );
    drawText('Menu + Left =', { x: 10, y: 90 }, { color: color.info });
    drawSelectableText(
        'Master',
        { x: 140, y: 90 },
        { color: color.white, font: font.bold },
        { edit: () => setView(View.Master) },
    );
    drawText('Menu + Up =', { x: 10, y: 110 }, { color: color.info });
    drawSelectableText(
        'Preset',
        { x: 130, y: 110 },
        { color: color.white, font: font.bold },
        { edit: () => setView(View.Preset) },
    );

    renderMessage();
}

export async function helpEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await renderView();
        return true;
    }
    const item = eventSelector(events);
    if (item) {
        await renderView();
        return true;
    }
    return false;
}
