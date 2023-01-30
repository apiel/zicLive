import { Events } from 'zic_node_ui';
import { View } from './def';
import { Direction, findNextSelectableItem, getSlectedItem, SelectableItem } from './selector';
import { getView, setView } from './view';

const KEY_UP = 82;
const KEY_DOWN = 81;
const KEY_LEFT = 80;
const KEY_RIGHT = 79;
const KEY_MENU = 4;
const KEY_EDIT = 22;
const KEY_ACTION = 20;

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

// TODO #2 findCloseFromSameColumn should be a number giving the max distance to search for a selectable item
export function eventSelector(events: Events, findCloseFromSameColumn = true): SelectableItem | undefined {
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
                return setView(View.Sequencer);
            }
            return true;
        }
        if (isEventUpPressed(events)) {
            keyState.menuTime = 0;
            return setView(View.Preset);
        } else if (isEventDownPressed(events)) {
            keyState.menuTime = 0;
            return setView(View.Pattern);
        } else if (isEventLeftPressed(events)) {
            keyState.menuTime = 0;
            return setView(View.Master);
        } else if (isEventRightPressed(events)) {
            keyState.menuTime = 0;
            // return setView(View.Project); // Might not even need Project, as everything can be done in master
            return setView(View.SequencerEdit);
        }
    }
    return false;
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
