import { Point } from 'zic_node_ui';

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export type EditHandler = (direction: number) => Promise<any> | any;

export interface SelectableOptions {
    onSelected?: () => void;
    edit?: EditHandler;
    steps?: [number, number]; // incrementation step for edit handler, first number is for left/right, second number is for up/down
}
export interface SelectableItem {
    position: Point;
    options?: SelectableOptions;
}

let selectableItems: SelectableItem[] = [];
let selectedItem = 0;

export function getSlectedItem() {
    return selectableItems[selectedItem];
}

export function pushSelectableItem(
    position: Point,
    options?: SelectableOptions,
): boolean {
    const id = selectableItems.push({ position, options }) - 1;
    return id === selectedItem;
}

export function cleanSelectableItems() {
    selectableItems = [];
}

// TODO need some refactoring
export function findNextSelectableItem(direction: Direction, findCloseFromSameColumn = true) {
    const current = selectableItems[selectedItem];
    let next: SelectableItem | undefined;
    let nextIndex = -1;
    if (findCloseFromSameColumn) {
        if (direction === Direction.UP) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (
                    item.position.x === current.position.x &&
                    item.position.y < current.position.y &&
                    (!next || item.position.y > next.position.y)
                ) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        } else if (direction === Direction.DOWN) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (
                    item.position.y < 10000000 &&
                    item.position.x === current.position.x &&
                    item.position.y > current.position.y &&
                    (!next || item.position.y < next.position.y)
                ) {
                    // item.position.y < 10000000 are item with negative pos, might find better fix!
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        } else if (direction === Direction.LEFT) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (
                    item.position.y === current.position.y &&
                    item.position.x < current.position.x &&
                    (!next || item.position.x > next.position.x)
                ) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        } else if (direction === Direction.RIGHT) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (
                    item.position.y === current.position.y &&
                    item.position.x > current.position.x &&
                    (!next || item.position.x < next.position.x)
                ) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        }
        if (next) {
            selectedItem = nextIndex;
            return next;
        }
    }

    if (direction === Direction.UP) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (
                item.position.y < current.position.y &&
                (!next || item.position.y > next.position.y)
            ) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    } else if (direction === Direction.DOWN) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (
                item.position.y < 10000000 &&
                item.position.y > current.position.y &&
                (!next || item.position.y < next.position.y)
            ) {
                // item.position.y < 10000000 are item with negative pos, might find better fix!
                next = item;
                nextIndex = parseInt(index);
            }
        }
    }
    // else if (direction === Direction.LEFT) {
    //     for (let index in selectableItems) {
    //         const item = selectableItems[index];
    //         if (item.position.x < current.position.x && (!next || item.position.x > next.position.x)) {
    //             next = item;
    //             nextIndex = parseInt(index);
    //         }
    //     }
    // } else if (direction === Direction.RIGHT) {
    //     for (let index in selectableItems) {
    //         const item = selectableItems[index];
    //         if (item.position.x > current.position.x && (!next || item.position.x < next.position.x)) {
    //             next = item;
    //             nextIndex = parseInt(index);
    //         }
    //     }
    // }

    if (next) {
        selectedItem = nextIndex;
    }
    return selectableItems[selectedItem];
}
