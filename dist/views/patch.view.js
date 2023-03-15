"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchEventHandler = exports.patchView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const patch_1 = require("../patch");
const sequence_1 = require("../sequence");
const style_1 = require("../style");
const kick23_1 = __importDefault(require("../patches/kick23"));
const synth_1 = __importDefault(require("../patches/synth"));
const events_1 = require("../events");
const selector_1 = require("../selector");
const config_1 = require("../config");
const drawMessage_1 = require("../draw/drawMessage");
const drawField_1 = require("../draw/drawField");
const rowNext_1 = require("../draw/rowNext");
const drawKeyboard_1 = require("../draw/drawKeyboard");
const drawSeparator_1 = require("../draw/drawSeparator");
let scrollY = 0;
let lastCurrentPatchId = -1;
let saveAs = '';
const col = config_1.config.screen.col;
async function patchView(options = {}) {
    (0, selector_1.cleanSelectableItems)();
    (0, zic_node_ui_1.clear)(style_1.color.background);
    const sequence = (0, sequence_1.getSelectedSequence)();
    if (!sequence) {
        (0, zic_node_ui_1.drawText)(`No patch selected`, { x: 10, y: 10 });
        return;
    }
    (0, rowNext_1.rowReset)();
    const patch = (0, patch_1.getPatch)(patch_1.currentPatchId);
    if (lastCurrentPatchId !== patch_1.currentPatchId) {
        scrollY = 0;
        lastCurrentPatchId = patch_1.currentPatchId;
        saveAs = patch.name;
    }
    (0, drawField_1.drawField)(`Patch`, patch_1.currentPatchId.toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            (0, patch_1.setCurrentPatchId)(patch_1.currentPatchId + direction);
        },
        steps: [1, 10]
    }, { scrollY, info: patch.name });
    (0, drawSeparator_1.drawSeparator)(patch.engine.name.charAt(0).toUpperCase() + patch.engine.name.slice(1), (0, rowNext_1.rowNext)(1), {
        scrollY,
        color: style_1.color.white,
    });
    switch (patch.engine.name) {
        case 'synth':
            (0, synth_1.default)(patch, scrollY);
            break;
        case 'midi':
            // TODO #38 preset view for midi
            (0, zic_node_ui_1.drawText)(`Engine "${patch.engine.name}", patch "${patch.name}"`, { x: 10, y: 10 });
            break;
        case 'kick23':
            (0, kick23_1.default)(patch, scrollY);
            break;
    }
    (0, drawField_1.drawFieldDual)(``, `Reload`, `Save`, (0, rowNext_1.rowNext)(1), {
        edit: (0, drawMessage_1.withInfo)('Loaded', () => patch.load()),
    }, {
        edit: (0, drawMessage_1.withSuccess)('Saved', () => patch.save()),
    }, { scrollY });
    (0, drawField_1.drawField)(`Save as`, saveAs, (0, rowNext_1.rowNext)(col), {
        edit: (0, drawMessage_1.withSuccess)('Saved', () => (0, patch_1.savePatchAs)(patch, saveAs)),
    }, {
        col,
        scrollY,
    });
    (0, drawKeyboard_1.drawKeyboard)((char) => {
        if (char === 'DEL') {
            saveAs = saveAs.slice(0, -1);
        }
        else if (char === 'DONE') {
            return (0, drawMessage_1.withSuccess)('Saved', () => (0, patch_1.savePatchAs)(patch, saveAs))();
        }
        else {
            if (saveAs.length < 10) {
                saveAs += char;
            }
        }
    }, { row: (0, rowNext_1.rowNext)(1), col, scrollY, done: 'SAVE' });
    (0, drawMessage_1.renderMessage)();
}
exports.patchView = patchView;
async function patchEventHandler(events) {
    const editMode = await (0, events_1.getEditMode)(events);
    if (editMode.refreshScreen) {
        await patchView();
        return true;
    }
    if (editMode.edit) {
        const updated = await (0, events_1.eventEdit)(events);
        if (updated) {
            await patchView();
            return true;
        }
        return false;
    }
    else {
        const item = (0, events_1.eventSelector)(events);
        if (item) {
            if (item.position.y > config_1.config.screen.size.h - 60) {
                scrollY -= 60;
            }
            else if (item.position.y < 60 && scrollY < 0) {
                scrollY += 60;
            }
            await patchView();
            return true;
        }
    }
    return false;
}
exports.patchEventHandler = patchEventHandler;
