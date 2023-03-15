"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNextSelectableItem = exports.cleanSelectableItems = exports.pushSelectableItem = exports.forceSelectedItem = exports.getSelectedIndex = exports.getSlectedItem = exports.Direction = void 0;
const def_1 = require("./def");
const view_1 = require("./view");
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction = exports.Direction || (exports.Direction = {}));
let selectableItems = [];
let selectedItem = Object.values(def_1.View)
    .reduce((acc, view) => {
    acc[view] = 0;
    return acc;
}, {});
function getSlectedItem() {
    const view = (0, view_1.getView)();
    if (selectedItem[view] > selectableItems.length) {
        selectedItem[view] = selectableItems.length - 1;
    }
    return selectableItems[selectedItem[view]];
}
exports.getSlectedItem = getSlectedItem;
function getSelectedIndex() {
    return selectedItem[(0, view_1.getView)()];
}
exports.getSelectedIndex = getSelectedIndex;
function forceSelectedItem(view, index) {
    selectedItem[view] = index;
}
exports.forceSelectedItem = forceSelectedItem;
function pushSelectableItem(position, options) {
    const id = selectableItems.push({ position, options }) - 1;
    return id === selectedItem[(0, view_1.getView)()];
}
exports.pushSelectableItem = pushSelectableItem;
function cleanSelectableItems() {
    selectableItems = [];
}
exports.cleanSelectableItems = cleanSelectableItems;
/**
 * Up Down search closest item in same column
 */
function findByColumn(direction, current) {
    let next;
    let nextIndex = -1;
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
    return nextIndex;
}
function findClosestUpDown(direction, current) {
    let nextRow = [];
    if (direction === Direction.UP) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.position.y < current.position.y) {
                if (!nextRow.length || item.position.y > nextRow[0].item.position.y) {
                    nextRow = [{ item, index: parseInt(index) }];
                }
                else if (item.position.y === nextRow[0].item.position.y) {
                    nextRow.push({ item, index: parseInt(index) });
                }
            }
        }
    }
    else if (direction === Direction.DOWN) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            // item.position.y < 10000000 are item with negative pos, might find better fix!
            if (item.position.y < 10000000 && item.position.y > current.position.y) {
                if (!nextRow.length || item.position.y < nextRow[0].item.position.y) {
                    nextRow = [{ item, index: parseInt(index) }];
                }
                else if (item.position.y === nextRow[0].item.position.y) {
                    nextRow.push({ item, index: parseInt(index) });
                }
            }
        }
    }
    if (nextRow.length) {
        // console.log({ nextRow });
        if (nextRow.length === 1) {
            return nextRow[0].index;
        }
        else {
            const priorityItem = nextRow.find((r) => r.item.options?.priority);
            if (priorityItem) {
                return priorityItem.index;
            }
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
function findClosestLeftRight(direction, current) {
    let next;
    let nextIndex = -1;
    if (direction === Direction.LEFT) {
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
    return nextIndex;
}
/**
 *
 * @param direction
 * @returns
 */
function findNextSelectableItem(direction, findByColumnFirst = false) {
    const view = (0, view_1.getView)();
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
    }
    catch (error) {
        console.error('Something went wrong while finding next selectable item', error);
    }
    return getSlectedItem();
}
exports.findNextSelectableItem = findNextSelectableItem;
