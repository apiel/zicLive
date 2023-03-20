"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEditMode = exports.eventEdit = exports.eventMenu = exports.eventSelector = exports.isEventEditRelease = exports.isEventEditPressed = exports.isEventMenuPressed = exports.isEventRightPressed = exports.isEventLeftPressed = exports.isEventDownPressed = exports.isEventUpPressed = exports.KEY_EDIT = exports.KEY_MENU = exports.KEY_RIGHT = exports.KEY_LEFT = exports.KEY_DOWN = exports.KEY_UP = void 0;
const def_1 = require("./def");
const patch_1 = require("./patch");
const selector_1 = require("./selector");
const sequence_1 = require("./sequence");
const view_1 = require("./view");
exports.KEY_UP = 82;
exports.KEY_DOWN = 81;
exports.KEY_LEFT = 80;
exports.KEY_RIGHT = 79;
exports.KEY_MENU = 4;
exports.KEY_EDIT = 22;
const keyState = {
    edit: false,
    menu: false,
    menuTime: 0,
    action: false,
};
function isEventUpPressed(events) {
    return events.keysDown?.includes(exports.KEY_UP);
}
exports.isEventUpPressed = isEventUpPressed;
function isEventDownPressed(events) {
    return events.keysDown?.includes(exports.KEY_DOWN);
}
exports.isEventDownPressed = isEventDownPressed;
function isEventLeftPressed(events) {
    return events.keysDown?.includes(exports.KEY_LEFT);
}
exports.isEventLeftPressed = isEventLeftPressed;
function isEventRightPressed(events) {
    return events.keysDown?.includes(exports.KEY_RIGHT);
}
exports.isEventRightPressed = isEventRightPressed;
function isEventMenuPressed(events) {
    return events.keysDown?.includes(exports.KEY_MENU);
}
exports.isEventMenuPressed = isEventMenuPressed;
function isEventEditPressed(events) {
    return events.keysDown?.includes(exports.KEY_EDIT);
}
exports.isEventEditPressed = isEventEditPressed;
function isEventEditRelease(events) {
    return events.keysUp?.includes(exports.KEY_EDIT);
}
exports.isEventEditRelease = isEventEditRelease;
function eventSelector(events, findCloseFromSameColumn = false) {
    if (events.keysDown) {
        if (isEventUpPressed(events)) {
            return (0, selector_1.findNextSelectableItem)(selector_1.Direction.UP, findCloseFromSameColumn);
        }
        if (isEventDownPressed(events)) {
            return (0, selector_1.findNextSelectableItem)(selector_1.Direction.DOWN, findCloseFromSameColumn);
        }
        if (isEventLeftPressed(events)) {
            return (0, selector_1.findNextSelectableItem)(selector_1.Direction.LEFT, findCloseFromSameColumn);
        }
        if (isEventRightPressed(events)) {
            return (0, selector_1.findNextSelectableItem)(selector_1.Direction.RIGHT, findCloseFromSameColumn);
        }
    }
}
exports.eventSelector = eventSelector;
let menuMode = def_1.View.Sequencer;
function eventMenu(events) {
    if (!keyState.menu && isEventMenuPressed(events)) {
        keyState.menu = true;
        keyState.menuTime = Date.now();
    }
    if (keyState.menu) {
        // Could show help if menuTime over 500?
        if (events.keysUp?.includes(exports.KEY_MENU)) {
            keyState.menu = false;
            if (keyState.menuTime && Date.now() - keyState.menuTime < 500) {
                if ((0, view_1.getView)() === def_1.View.Sequencer) {
                    return (0, view_1.setView)(def_1.View.SequencerEdit);
                }
                menuMode = def_1.View.Sequencer;
                return (0, view_1.setView)(def_1.View.Sequencer);
            }
            return true;
        }
        if (isEventUpPressed(events)) {
            keyState.menuTime = 0;
            menuMode = def_1.View.Patch;
            return (0, view_1.setView)(def_1.View.Patch);
        }
        else if (isEventDownPressed(events)) {
            keyState.menuTime = 0;
            menuMode = def_1.View.Master;
            return (0, view_1.setView)(def_1.View.Master);
        }
        else if (isEventLeftPressed(events)) {
            return eventMenuLeftRight(-1);
        }
        else if (isEventRightPressed(events)) {
            return eventMenuLeftRight(+1);
        }
    }
    return false;
}
exports.eventMenu = eventMenu;
function eventMenuLeftRight(direction) {
    keyState.menuTime = 0;
    switch (menuMode) {
        case def_1.View.Sequencer:
            const changed = (0, view_1.setView)(def_1.View.SequencerEdit);
            if (!changed) {
                (0, sequence_1.incSelectedSequenceId)(direction);
            }
            break;
        case def_1.View.Patch:
            (0, patch_1.setCurrentPatchId)(patch_1.currentPatchId + direction);
            break;
        case def_1.View.Master:
            break;
    }
    return true;
}
async function eventEdit(events) {
    const { options } = (0, selector_1.getSlectedItem)();
    if (!options || !options.edit) {
        return false;
    }
    const { steps, edit } = options;
    if (isEventUpPressed(events)) {
        await edit(+1 * (steps?.[1] ?? 1));
        return true;
    }
    else if (isEventDownPressed(events)) {
        await edit(-1 * (steps?.[1] ?? 1));
        return true;
    }
    else if (isEventLeftPressed(events)) {
        await edit(-1 * (steps?.[0] ?? 1));
        return true;
    }
    else if (isEventRightPressed(events)) {
        await edit(+1 * (steps?.[0] ?? 1));
        return true;
    }
    else {
        return false;
    }
}
exports.eventEdit = eventEdit;
async function getEditMode(events) {
    if (isEventEditPressed(events)) {
        keyState.edit = true;
    }
    if (keyState.edit && isEventEditRelease(events)) {
        const item = (0, selector_1.getSlectedItem)();
        keyState.edit = false;
        if (item?.options?.edit) {
            await item.options.edit(0);
            return { edit: false, refreshScreen: true };
        }
    }
    return { edit: keyState.edit, refreshScreen: false };
}
exports.getEditMode = getEditMode;
