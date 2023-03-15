"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterEventHandler = exports.masterView = void 0;
const zic_node_1 = require("zic_node");
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const drawButton_1 = require("../draw/drawButton");
const drawField_1 = require("../draw/drawField");
const drawMessage_1 = require("../draw/drawMessage");
const rowNext_1 = require("../draw/rowNext");
const events_1 = require("../events");
const selector_1 = require("../selector");
const style_1 = require("../style");
const util_1 = require("../util");
const col = config_1.config.screen.col;
async function masterView(options = {}) {
    (0, selector_1.cleanSelectableItems)();
    (0, zic_node_ui_1.clear)(style_1.color.background);
    // There could come:
    //   - Master FX1 and FX2, those field might have more than 1 value
    //   - Master Filter? (or should it be part of master FX?)
    //   - Mixer?
    //   - Scatter?
    (0, rowNext_1.rowReset)();
    (0, drawField_1.drawField)(`Volume`, Math.round((0, zic_node_1.getMasterVolume)() * 100).toString(), (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            const volume = (0, util_1.minmax)((0, zic_node_1.getMasterVolume)() + direction, 0, 1);
            (0, zic_node_1.setMasterVolume)(volume);
        },
        steps: [0.01, 0.1],
    });
    (0, drawField_1.drawField)(`BPM`, (0, zic_node_1.getBpm)().toString(), (0, rowNext_1.rowNext)(2), {
        edit: (direction) => {
            (0, zic_node_1.setBpm)((0, util_1.minmax)((0, zic_node_1.getBpm)() + direction, 10, 250));
        },
    }, {
        col,
    });
    (0, drawField_1.drawField)(`Project id`, `#000`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            console.log('change project', direction);
        },
    });
    (0, drawField_1.drawField)(`Name`, `Tek23!`, (0, rowNext_1.rowNext)(2), {
        edit: (direction) => {
            console.log('edit project name', direction);
        },
    }, {
        col,
    });
    (0, drawButton_1.drawButton)('Save', (0, rowNext_1.rowNext)(1), () => console.log('save project'));
    (0, drawButton_1.drawButton)('Reload', (0, rowNext_1.rowNext)(2), () => console.log('reload project'), { col });
    (0, drawMessage_1.renderMessage)();
}
exports.masterView = masterView;
async function masterEventHandler(events) {
    const editMode = await (0, events_1.getEditMode)(events);
    if (editMode.refreshScreen) {
        await masterView();
        return true;
    }
    if (editMode.edit) {
        const updated = await (0, events_1.eventEdit)(events);
        if (updated) {
            await masterView();
            return true;
        }
        return false;
    }
    else {
        const item = (0, events_1.eventSelector)(events);
        if (item) {
            // if (item.position.x < config.screen.size.w / 2) {
            //     if (item.position.y > config.screen.size.h - 50) {
            //         scrollY -= 50;
            //     } else if (item.position.y < 40 && scrollY < 0) {
            //         scrollY += 50;
            //     }
            // }
            await masterView();
            return true;
        }
    }
    return false;
}
exports.masterEventHandler = masterEventHandler;
