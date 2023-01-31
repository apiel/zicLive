import { Point } from 'zic_node_ui';
import { View } from './def';
import { getView } from './view';

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
let selectedItem: { [view: number]: number } = Object.values(View)
    .filter((v) => !isNaN(v as any))
    .reduce((acc, view) => {
        acc[view as number] = 0;
        return acc;
    }, {} as { [view: number]: number });

export function getSlectedItem() {
    const view = getView();
    if (selectedItem[view] > selectableItems.length) {
        selectedItem[view] = selectableItems.length - 1;
    }
    return selectableItems[selectedItem[view]];
}

export function forceSelectedItem(view: View, index: number) {
    selectedItem[view] = index;
}

export function pushSelectableItem(position: Point, options?: SelectableOptions): boolean {
    const id = selectableItems.push({ position, options }) - 1;
    return id === selectedItem[getView()];
}

export function cleanSelectableItems() {
    selectableItems = [];
}

/**
 * Up Down search closest item in same column
 */
function findByColumn(direction: Direction, current: SelectableItem) {
    let next: SelectableItem | undefined;
    let nextIndex = -1;
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
    }
    return nextIndex;
}

function findClosestUpDown(direction: Direction, current: SelectableItem) {
    let nextRow: { item: SelectableItem; index: number }[] = [];
    if (direction === Direction.UP) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.position.y < current.position.y) {
                if (!nextRow.length || item.position.y > nextRow[0].item.position.y) {
                    nextRow = [{ item, index: parseInt(index) }];
                } else if (item.position.y === nextRow[0].item.position.y) {
                    nextRow.push({ item, index: parseInt(index) });
                }
            }
        }
    } else if (direction === Direction.DOWN) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            // item.position.y < 10000000 are item with negative pos, might find better fix!
            if (item.position.y < 10000000 && item.position.y > current.position.y) {
                if (!nextRow.length || item.position.y < nextRow[0].item.position.y) {
                    nextRow = [{ item, index: parseInt(index) }];
                } else if (item.position.y === nextRow[0].item.position.y) {
                    nextRow.push({ item, index: parseInt(index) });
                }
            }
        }
    }

    if (nextRow.length) {
        // console.log({ nextRow });
        if (nextRow.length === 1) {
            return nextRow[0].index;
        } else {
            let next = nextRow[0];
            let distance = Math.abs(next.item.position.x - current.position.x);
            for (let next2 of nextRow) {
                const newDistance = Math.abs(next2.item.position.x - current.position.x);
                if (newDistance < distance) {
                    next = next2;
                    distance = newDistance;
                }
            }
            return next.index;
        }
    }
    return -1;
}

function findClosestLeftRight(direction: Direction, current: SelectableItem) {
    let next: SelectableItem | undefined;
    let nextIndex = -1;
    if (direction === Direction.LEFT) {
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
    return nextIndex;
}

/**
 *
 * @param direction
 * @returns
 */
export function findNextSelectableItem(direction: Direction, findByColumnFirst = false) {
    const view = getView();
    try {
        const current = getSlectedItem();

        let nextIndex = -1;
        if (findByColumnFirst) {
            nextIndex = findByColumn(direction, current);
            if (nextIndex !== -1) {
                selectedItem[view] = nextIndex;
                return selectableItems[nextIndex];
            }
        }

        nextIndex = findClosestUpDown(direction, current);
        if (nextIndex !== -1) {
            selectedItem[view] = nextIndex;
            return selectableItems[nextIndex];
        }
 
        nextIndex = findClosestLeftRight(direction, current);
        if (nextIndex !== -1) {
            selectedItem[view] = nextIndex;
            return selectableItems[nextIndex];
        }
    } catch (error) {
        console.error('Something went wrong while finding next selectable item', error);
    }

    return getSlectedItem();
}
