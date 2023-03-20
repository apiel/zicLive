"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceEditHeader = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const sequence_1 = require("../sequence");
const style_1 = require("../style");
const patternPreview_node_1 = require("./patternPreview.node");
const sequenceMiniGridSelection_node_1 = require("./sequenceMiniGridSelection.node");
const { margin } = style_1.unit;
function sequenceEditHeader(currentStep) {
    const { trackId, stepCount, steps, activeStep } = (0, sequence_1.getSelectedSequence)();
    (0, sequenceMiniGridSelection_node_1.sequenceMiniGridSelection)();
    if (trackId !== undefined) {
        const patternPreviewPosition = { x: 165, y: margin };
        const patternPreviewRect = {
            position: patternPreviewPosition,
            size: { w: config_1.config.screen.size.w - (patternPreviewPosition.x + margin * 2), h: 83 },
        };
        (0, zic_node_ui_1.setColor)(style_1.color.foreground);
        (0, zic_node_ui_1.drawFilledRect)(patternPreviewRect);
        (0, patternPreview_node_1.patternPreviewNode)(patternPreviewRect, stepCount, steps, activeStep, currentStep);
    }
}
exports.sequenceEditHeader = sequenceEditHeader;
