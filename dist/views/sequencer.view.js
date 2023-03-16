"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencerEventHandler = exports.sequencerView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const events_1 = require("../events");
const selector_1 = require("../selector");
const style_1 = require("../style");
const sequence_1 = require("../sequence");
const drawMessage_1 = require("../draw/drawMessage");
const track_1 = require("../track");
const sequence_node_1 = require("../nodes/sequence.node");
let scrollY = 0;
const col = config_1.config.sequence.col;
const { margin } = style_1.unit;
const height = config_1.config.screen.size.h / config_1.config.sequence.row;
const sequenceWidth = config_1.config.screen.size.w / config_1.config.sequence.col - margin;
const sequenceRect = (id, scrollY = 0) => {
    const size = { w: sequenceWidth, h: height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * (id % col),
            y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
        },
        size,
    };
};
// TODO #49 optimize rendering and draw only visible items
async function sequencerView(options = {}) {
    (0, selector_1.cleanSelectableItems)();
    (0, zic_node_ui_1.clear)(style_1.color.background);
    for (let i = 0; i < 40; i++) {
        const rect = sequenceRect(i, scrollY);
        if (sequence_1.sequences[i]) {
            const { id, trackId, nextSequenceId, ...seq } = sequence_1.sequences[i];
            let next;
            if (nextSequenceId !== undefined) {
                next = nextSequenceId.toString();
            }
            (0, sequence_node_1.sequenceNode)(id, rect, {
                ...seq,
                trackColor: (0, track_1.getTrackStyle)(trackId).color,
                next,
            });
        }
        else {
            (0, zic_node_ui_1.setColor)(style_1.color.foreground);
            (0, zic_node_ui_1.drawFilledRect)(rect);
        }
    }
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
