"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencerEventHandler = exports.sequencerView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const events_1 = require("../events");
const selector_1 = require("../selector");
const style_1 = require("../style");
const sequencesGrid_node_1 = require("../nodes/sequencesGrid.node");
const sequence_1 = require("../sequence");
const def_1 = require("../def");
const drawMessage_1 = require("../draw/drawMessage");
let scrollY = 0;
const col = config_1.config.sequence.col;
// TODO #49 optimize rendering and draw only visible items
async function sequencerView(options = {}) {
    (0, selector_1.cleanSelectableItems)();
    (0, zic_node_ui_1.clear)(style_1.color.background);
    (0, sequencesGrid_node_1.sequencesGridNode)(col, scrollY, (id) => ({
        edit: () => (0, sequence_1.toggleSequence)((0, sequence_1.getSequence)(id)),
        onSelected: () => {
            if (id !== -1) {
                (0, sequence_1.setSelectedSequenceId)(id);
            }
            (0, selector_1.forceSelectedItem)(def_1.View.SequencerEdit, id);
        },
    }));
    (0, drawMessage_1.renderMessage)();
}
exports.sequencerView = sequencerView;
async function sequencerEventHandler(events) {
    const editMode = await (0, events_1.getEditMode)(events);
    if (editMode.refreshScreen) {
        await sequencerView();
        return true;
    }
    const item = (0, events_1.eventSelector)(events);
    if (item) {
        if (item.position.y > config_1.config.screen.size.h - 50) {
            scrollY -= 50;
        }
        else if (item.position.y < 40 && scrollY < 0) {
            scrollY += 50;
        }
        item.options?.onSelected?.();
        await sequencerView();
        return true;
    }
    return false;
}
exports.sequencerEventHandler = sequencerEventHandler;
