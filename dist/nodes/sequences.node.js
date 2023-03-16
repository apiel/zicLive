"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencesNode = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const sequence_node_1 = require("./sequence.node");
const drawSelectable_1 = require("../draw/drawSelectable");
const sequence_1 = require("../sequence");
const style_1 = require("../style");
const track_1 = require("../track");
function sequencesNode(sequences, scrollY, sequenceRect, getSelectableOptions = () => ({}), { selectedId } = { selectedId: -1 }) {
    for (let i = 0; i < sequences.length; i++) {
        const { id, trackId, nextSequenceId, ...seq } = sequences[i];
        let next;
        if (nextSequenceId !== undefined) {
            // const nextSeq = sequences[nextSequenceId];
            // next = `${seq.nextSequenceId} ${getPatch(nextSeq.patchId).name}`;
            next = nextSequenceId.toString();
        }
        const props = {
            ...seq,
            trackColor: (0, track_1.getTrackStyle)(trackId).color,
            next,
            selected: selectedId === id,
        };
        const rect = sequenceRect(i, scrollY);
        (0, sequence_node_1.sequenceNode)(id, rect, props);
        // drawSelectableRect(rect, color.sequencer.selected, getSelectableOptions(id));
    }
    const addRect = sequenceRect(sequences.length, scrollY);
    (0, zic_node_ui_1.setColor)(style_1.color.foreground);
    (0, zic_node_ui_1.drawFilledRect)(addRect);
    (0, drawSelectable_1.drawSelectableRect)(addRect, style_1.color.sequencer.selected, {
        ...getSelectableOptions(-1),
        edit: sequence_1.newSequence,
    });
    (0, zic_node_ui_1.drawText)(`+`, { x: addRect.position.x - 10 + addRect.size.w / 2, y: addRect.position.y }, { color: style_1.color.info, size: 40, font: style_1.font.bold });
}
exports.sequencesNode = sequencesNode;
