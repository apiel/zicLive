import { Events } from 'zic_node_ui';
import { Direction, findNextSelectableItem } from './selector';

const KEY_UP = 82;
const KEY_DOWN = 81;
const KEY_LEFT = 80;
const KEY_RIGHT = 79;

export function eventSelector(events: Events) {
    if (events.keysDown) {
        if (events.keysDown.includes(KEY_UP)) {
            findNextSelectableItem(Direction.UP);
        }
        if (events.keysDown.includes(KEY_DOWN)) {
            findNextSelectableItem(Direction.DOWN);
        }
        if (events.keysDown.includes(KEY_LEFT)) {
            findNextSelectableItem(Direction.LEFT);
        }
        if (events.keysDown.includes(KEY_RIGHT)) {
            findNextSelectableItem(Direction.RIGHT);
        }
    }
}
