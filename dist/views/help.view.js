"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpEventHandler = exports.helpView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const def_1 = require("../def");
const drawMessage_1 = require("../draw/drawMessage");
const drawSelectable_1 = require("../draw/drawSelectable");
const events_1 = require("../events");
const selector_1 = require("../selector");
const style_1 = require("../style");
const view_1 = require("../view");
async function helpView(options = {}) {
    (0, selector_1.cleanSelectableItems)();
    (0, zic_node_ui_1.clear)(style_1.color.background);
    (0, zic_node_ui_1.drawText)('Menu (>1sec) =', { x: 10, y: 10 }, { color: style_1.color.info });
    (0, drawSelectable_1.drawSelectableText)('Help', { x: 150, y: 10 }, { color: style_1.color.white, font: style_1.font.bold }, { edit: () => (0, view_1.setView)(def_1.View.Help) });
    (0, zic_node_ui_1.drawText)('Menu (<0.5sec) =', { x: 10, y: 30 }, { color: style_1.color.info });
    (0, drawSelectable_1.drawSelectableText)('Sequencer / Sequencer Edit', { x: 165, y: 30 }, { color: style_1.color.white, font: style_1.font.bold }, { edit: () => (0, view_1.setView)(def_1.View.Sequencer) });
    (0, zic_node_ui_1.drawText)('Menu + Right =', { x: 10, y: 50 }, { color: style_1.color.info });
    (0, drawSelectable_1.drawSelectableText)('Project', { x: 145, y: 50 }, { color: style_1.color.white, font: style_1.font.bold }, { edit: () => (0, view_1.setView)(def_1.View.Project) });
    // drawText('Menu + Down =', { x: 10, y: 70 }, { color: color.info });
    // drawSelectableText(
    //     'Pattern',
    //     { x: 150, y: 70 },
    //     { color: color.white, font: font.bold },
    //     { edit: () => setView(View.Pattern) },
    // );
    (0, zic_node_ui_1.drawText)('Menu + Left =', { x: 10, y: 90 }, { color: style_1.color.info });
    (0, drawSelectable_1.drawSelectableText)('Master', { x: 140, y: 90 }, { color: style_1.color.white, font: style_1.font.bold }, { edit: () => (0, view_1.setView)(def_1.View.Master) });
    (0, zic_node_ui_1.drawText)('Menu + Up =', { x: 10, y: 110 }, { color: style_1.color.info });
    (0, drawSelectable_1.drawSelectableText)('Patch', { x: 130, y: 110 }, { color: style_1.color.white, font: style_1.font.bold }, { edit: () => (0, view_1.setView)(def_1.View.Patch) });
    (0, drawMessage_1.renderMessage)();
}
exports.helpView = helpView;
async function helpEventHandler(events) {
    const editMode = await (0, events_1.getEditMode)(events);
    if (editMode.refreshScreen) {
        await (0, view_1.renderView)();
        return true;
    }
    const item = (0, events_1.eventSelector)(events);
    if (item) {
        await (0, view_1.renderView)();
        return true;
    }
    return false;
}
exports.helpEventHandler = helpEventHandler;
