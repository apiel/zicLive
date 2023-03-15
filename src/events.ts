import { Events } from 'zic_node_ui';
import { View } from './def';
import { currentPatchId, setCurrentPatchId } from './patch';
import { Direction, findNextSelectableItem, getSlectedItem, SelectableItem } from './selector';
import { incSelectedSequenceId } from './sequence';
import { getView, setView } from './view';

export const KEY_UP = 82;
export const KEY_DOWN = 81;
export const KEY_LEFT = 80;
export const KEY_RIGHT = 79;
export const KEY_MENU = 4;
export const KEY_EDIT = 22;

const keyState = {
    edit: false,
    menu: false,
    menuTime: 0,
    action: false,
};

export function isEventUpPressed(events: Events) {
    return events.keysDown?.includes(KEY_UP);
}

export function isEventDownPressed(events: Events) {
    return events.keysDown?.includes(KEY_DOWN);
}

export function isEventLeftPressed(events: Events) {
    return events.keysDown?.includes(KEY_LEFT);
}

export function isEventRightPressed(events: Events) {
    return events.keysDown?.includes(KEY_RIGHT);
}

export function isEventMenuPressed(events: Events) {
    return events.keysDown?.includes(KEY_MENU);
}

export function isEventEditPressed(events: Events) {
    return events.keysDown?.includes(KEY_EDIT);
}

export function isEventEditRelease(events: Events) {
    return events.keysUp?.includes(KEY_EDIT);
}

export function eventSelector(events: Events, findCloseFromSameColumn = false): SelectableItem | undefined {
    if (events.keysDown) {
        if (isEventUpPressed(events)) {
            return findNextSelectableItem(Direction.UP, findCloseFromSameColumn);
        }
        if (isEventDownPressed(events)) {
            return findNextSelectableItem(Direction.DOWN, findCloseFromSameColumn);
        }
        if (isEventLeftPressed(events)) {
            return findNextSelectableItem(Direction.LEFT, findCloseFromSameColumn);
        }
        if (isEventRightPressed(events)) {
            return findNextSelectableItem(Direction.RIGHT, findCloseFromSameColumn);
        }
    }
}

let menuMode = View.Sequencer;
export function eventMenu(events: Events) {
    if (!keyState.menu && isEventMenuPressed(events)) {
        keyState.menu = true;
        keyState.menuTime = Date.now();
    }
    if (keyState.menu) {
        // Could show help if menuTime over 500?
        if (keyState.menuTime && Date.now() - keyState.menuTime > 1000) {
            keyState.menuTime = 0;
            return setView(View.Help);
        }
        if (events.keysUp?.includes(KEY_MENU)) {
            keyState.menu = false;
            if (keyState.menuTime && Date.now() - keyState.menuTime < 500) {
                if (getView() === View.Sequencer) {
                    return setView(View.SequencerEdit);
                }
                menuMode = View.Sequencer;
                return setView(View.Sequencer);
            }
            return true;
        }
        if (isEventUpPressed(events)) {
            keyState.menuTime = 0;
            menuMode = View.Patch;
            return setView(View.Patch);
        } else if (isEventDownPressed(events)) {
            keyState.menuTime = 0;
            menuMode = View.Master;
            return setView(View.Master);
        } else if (isEventLeftPressed(events)) {
            return eventMenuLeftRight(-1);
        } else if (isEventRightPressed(events)) {
            return eventMenuLeftRight(+1);
        }
    }
    return false;
}

function eventMenuLeftRight(direction: number) {
    keyState.menuTime = 0;
    switch (menuMode) {
        case View.Sequencer:
            const changed = setView(View.SequencerEdit);
            if (!changed) {
                incSelectedSequenceId(direction);
            }
            break;
        case View.Patch:
            setCurrentPatchId(currentPatchId + direction);
            break;
        case View.Master:
            break;
    }
    return true;
}

export async function eventEdit(events: Events) {
    const { options } = getSlectedItem();
    if (!options || !options.edit) {
        return false;
    }
    const { steps, edit } = options;
    if (isEventUpPressed(events)) {
        await edit(+1 * (steps?.[1] ?? 1));
        return true;
    } else if (isEventDownPressed(events)) {
        await edit(-1 * (steps?.[1] ?? 1));
        return true;
    } else if (isEventLeftPressed(events)) {
        await edit(-1 * (steps?.[0] ?? 1));
        return true;
    } else if (isEventRightPressed(events)) {
        await edit(+1 * (steps?.[0] ?? 1));
        return true;
    } else {
        return false;
    }
}

export async function getEditMode(events: Events) {
    if (isEventEditPressed(events)) {
        keyState.edit = true;
    }
    if (keyState.edit && isEventEditRelease(events)) {
        const item = getSlectedItem();
        keyState.edit = false;
        if (item?.options?.edit) {
            await item.options.edit(0);
            return { edit: false, refreshScreen: true };
        }
    }
    return { edit: keyState.edit, refreshScreen: false };
}
