import { Events } from 'zic_node_ui';
import { Direction, findNextSelectableItem } from './selector';

const KEY_UP = 82;
const KEY_DOWN = 81;
const KEY_LEFT = 80;
const KEY_RIGHT = 79;
const KEY_MENU = 4;
const KEY_EDIT = 22;

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

export function eventSelector(events: Events) {
    if (events.keysDown) {
        if (isEventUpPressed(events)) {
            return findNextSelectableItem(Direction.UP);
        }
        if (isEventDownPressed(events)) {
            return findNextSelectableItem(Direction.DOWN);
        }
        if (isEventLeftPressed(events)) {
            return findNextSelectableItem(Direction.LEFT);
        }
        if (isEventRightPressed(events)) {
            return findNextSelectableItem(Direction.RIGHT);
        }
    }
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
