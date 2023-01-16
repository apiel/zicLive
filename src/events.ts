import { Events } from 'zic_node_ui';
import { Direction, findNextSelectableItem } from './selector';

const KEY_UP = 82;
const KEY_DOWN = 81;
const KEY_LEFT = 80;
const KEY_RIGHT = 79;

export function eventSelector(events: Events) {
    if (events.keysDown) {
        if (events.keysDown.includes(KEY_UP)) {
            return findNextSelectableItem(Direction.UP);
        }
        if (events.keysDown.includes(KEY_DOWN)) {
            return findNextSelectableItem(Direction.DOWN);
        }
        if (events.keysDown.includes(KEY_LEFT)) {
            return findNextSelectableItem(Direction.LEFT);
        }
        if (events.keysDown.includes(KEY_RIGHT)) {
            return findNextSelectableItem(Direction.RIGHT);
        }
    }
}
