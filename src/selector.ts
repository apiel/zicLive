import { Point } from "zic_node_ui";

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

let selectableItems: Point[] = [];
let selectedItem = 0;

export function pushSelectableItem(position: Point) {
    return selectableItems.push(position) - 1 === selectedItem;
}

export function cleanSelectableItems() {
    selectableItems = [];
}

// TODO need some refactoring
export function findNextSelectableItem(direction: Direction) {
    const current = selectableItems[selectedItem];
    let next: Point | undefined;
    let nextIndex = -1;
    if (direction === Direction.UP) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.x === current.x && item.y < current.y && (!next || item.y > next.y)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    } else if (direction === Direction.DOWN) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.x === current.x && item.y > current.y && (!next || item.y < next.y)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    } else if (direction === Direction.LEFT) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.y === current.y && item.x < current.x && (!next || item.x > next.x)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    } else if (direction === Direction.RIGHT) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.y === current.y && item.x > current.x && (!next || item.x < next.x)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    }
    if (next) {
        selectedItem = nextIndex;
    } else {
        if (direction === Direction.UP) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (item.y < current.y && (!next || item.y > next.y)) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        } else if (direction === Direction.DOWN) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (item.y > current.y && (!next || item.y < next.y)) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        }
        // else if (direction === Direction.LEFT) {
        //     for (let index in selectableItems) {
        //         const item = selectableItems[index];
        //         if (item.x < current.x && (!next || item.x > next.x)) {
        //             next = item;
        //             nextIndex = parseInt(index);
        //         }
        //     }
        // } else if (direction === Direction.RIGHT) {
        //     for (let index in selectableItems) {
        //         const item = selectableItems[index];
        //         if (item.x > current.x && (!next || item.x < next.x)) {
        //             next = item;
        //             nextIndex = parseInt(index);
        //         }
        //     }
        // }
    }
    if (next) {
        selectedItem = nextIndex;
    }
}