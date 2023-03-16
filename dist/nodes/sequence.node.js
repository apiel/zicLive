"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceNode = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const style_1 = require("../style");
const patternPreview_node_1 = require("./patternPreview.node");
const util_1 = require("../util");
function sequenceNode(id, { position, size }, { trackColor, playing, detune, next, repeat, stepCount, steps, activeStep, selected }) {
    (0, zic_node_ui_1.setColor)(playing ? style_1.color.sequencer.playing : style_1.color.foreground);
    (0, zic_node_ui_1.drawFilledRect)({ position, size });
    (0, zic_node_ui_1.drawText)(`${id + 1}`.padStart(3, '0'), { x: position.x + 2, y: position.y + 1 }, { color: trackColor, size: 10, font: style_1.font.bold });
    if (next !== undefined) {
        (0, zic_node_ui_1.drawText)(`>${(0, util_1.truncate)(next, 10)}`, { x: position.x + 22, y: position.y + 1 }, { color: style_1.color.sequencer.info, size: 10, font: style_1.font.regular });
    }
    const text = (0, zic_node_ui_1.drawText)(`${detune < 0 ? detune : `+${detune}`} x${repeat}`, { x: position.x + 2, y: position.y + 13 }, { color: style_1.color.sequencer.info, size: 10, font: style_1.font.regular });
    const patternPosition = { x: position.x + 2, y: text.position.y + text.size.h + 1 };
    const patternSize = { w: size.w - 4, h: size.h - (patternPosition.y - position.y) - 4 };
    (0, zic_node_ui_1.setColor)(trackColor);
    (0, zic_node_ui_1.drawFilledRect)({ position: patternPosition, size: patternSize });
    (0, patternPreview_node_1.patternPreviewNode)({ x: patternPosition.x + 2, y: patternPosition.y + 2 }, { w: patternSize.w - 4, h: patternSize.h - 6 }, stepCount, steps, playing);
    if (activeStep !== undefined) {
        renderActiveStep(patternPosition, size, stepCount, activeStep);
    }
    if (selected) {
        (0, zic_node_ui_1.setColor)(style_1.color.secondarySelected);
        (0, zic_node_ui_1.drawRect)({ position, size });
    }
    return { position, size };
}
exports.sequenceNode = sequenceNode;
function renderActiveStep(position, size, stepCount, step) {
    (0, zic_node_ui_1.setColor)(style_1.color.sequencer.pattern.playing);
    const stepWidth = (size.w - 2) / stepCount;
    (0, zic_node_ui_1.drawLine)({ x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y }, { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y + 20 });
}
