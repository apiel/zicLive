"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceMiniGridSelection = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const sequence_1 = require("../sequence");
const style_1 = require("../style");
const track_1 = require("../track");
const { margin } = style_1.unit;
const sequenceRect = (id) => {
    const size = { w: 25, h: 15 };
    return {
        position: {
            x: margin + (margin + size.w) * (id % config_1.config.sequence.col),
            y: margin + (margin + size.h) * Math.floor(id / config_1.config.sequence.col),
        },
        size,
    };
};
function sequenceMiniGridSelection() {
    for (let i = 0; i < 30; i++) {
        const rect = sequenceRect(i);
        const { trackId } = sequence_1.sequences[i];
        (0, zic_node_ui_1.setColor)(trackId !== undefined ? (0, track_1.getTrackStyle)(trackId).color : style_1.color.foreground);
        (0, zic_node_ui_1.drawFilledRect)(rect);
        const isSelected = (0, sequence_1.getSelectedSequenceId)() === i;
        (0, zic_node_ui_1.drawText)(`${i + 1}`.padStart(3, '0'), { x: rect.position.x + 4, y: rect.position.y + 1 }, { color: style_1.color.foreground3, size: 10, font: style_1.font.regular });
        if (isSelected) {
            // TODO find better selection color
            (0, zic_node_ui_1.setColor)(style_1.color.white);
            (0, zic_node_ui_1.drawRect)(rect);
        }
    }
}
exports.sequenceMiniGridSelection = sequenceMiniGridSelection;
