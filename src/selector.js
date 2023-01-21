"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNextSelectableItem = exports.cleanSelectableItems = exports.pushSelectableItem = exports.getSlectedItem = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction = exports.Direction || (exports.Direction = {}));
let selectableItems = [];
let selectedItem = 0;
function getSlectedItem() {
    return selectableItems[selectedItem];
}
exports.getSlectedItem = getSlectedItem;
function pushSelectableItem(position, options) {
    const id = selectableItems.push({ position, options }) - 1;
    return id === selectedItem;
}
exports.pushSelectableItem = pushSelectableItem;
function cleanSelectableItems() {
    selectableItems = [];
}
exports.cleanSelectableItems = cleanSelectableItems;
// TODO need some refactoring
function findNextSelectableItem(direction, findCloseFromSameColumn = true) {
    try {
        const current = selectableItems[selectedItem];
        let next;
        let nextIndex = -1;
        if (findCloseFromSameColumn) {
            if (direction === Direction.UP) {
                for (let index in selectableItems) {
                    const item = selectableItems[index];
                    if (item.position.x === current.position.x &&
                        item.position.y < current.position.y &&
                        (!next || item.position.y > next.position.y)) {
                        next = item;
                        nextIndex = parseInt(index);
                    }
                }
            }
            else if (direction === Direction.DOWN) {
                for (let index in selectableItems) {
                    const item = selectableItems[index];
                    if (item.position.y < 10000000 &&
                        item.position.x === current.position.x &&
                        item.position.y > current.position.y &&
                        (!next || item.position.y < next.position.y)) {
                        // item.position.y < 10000000 are item with negative pos, might find better fix!
                        next = item;
                        nextIndex = parseInt(index);
                    }
                }
            }
            else if (direction === Direction.LEFT) {
                for (let index in selectableItems) {
                    const item = selectableItems[index];
                    if (item.position.y === current.position.y &&
                        item.position.x < current.position.x &&
                        (!next || item.position.x > next.position.x)) {
                        next = item;
                        nextIndex = parseInt(index);
                    }
                }
            }
            else if (direction === Direction.RIGHT) {
                for (let index in selectableItems) {
                    const item = selectableItems[index];
                    if (item.position.y === current.position.y &&
                        item.position.x > current.position.x &&
                        (!next || item.position.x < next.position.x)) {
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
                if (item.position.y < current.position.y &&
                    (!next || item.position.y > next.position.y)) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        }
        else if (direction === Direction.DOWN) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (item.position.y < 10000000 &&
                    item.position.y > current.position.y &&
                    (!next || item.position.y < next.position.y)) {
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
    }
    catch (error) {
        console.error('Something went wrong while finding next selectable item', error);
    }
    return selectableItems[selectedItem];
}
exports.findNextSelectableItem = findNextSelectableItem;
