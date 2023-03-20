"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patternPreviewNode = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const style_1 = require("../style");
function patternPreviewNode({ position, size }, stepCount, _steps, activeStep, currentStep) {
    const stepWidth = Math.max((size.w - 2) / stepCount, 2);
    const steps = _steps.map((voices) => voices.filter((v) => v)); // remove undefined/null
    const notes = steps.flatMap((voices) => voices.map((v) => v.note));
    const noteMin = Math.min(...notes);
    const noteRange = Math.max(...notes) - noteMin;
    if (currentStep !== undefined) {
        (0, zic_node_ui_1.setColor)(style_1.color.foreground2);
        (0, zic_node_ui_1.drawFilledRect)({
            position: {
                x: position.x + currentStep * stepWidth,
                y: position.y,
            },
            size: {
                w: stepWidth - 1,
                h: size.h - 1,
            },
        });
    }
    if (noteRange === 0) {
        for (let step = 0; step < stepCount; step++) {
            if (steps[step].length) {
                const rect = {
                    position: {
                        x: position.x + step * stepWidth,
                        y: position.y + size.h / 2,
                    },
                    size: {
                        w: stepWidth - 1,
                        h: 5,
                    },
                };
                (0, zic_node_ui_1.setColor)(currentStep === step ? style_1.color.sequencer.pattern.currentStep : style_1.color.sequencer.pattern.step);
                (0, zic_node_ui_1.drawFilledRect)(rect);
            }
        }
    }
    else {
        for (let step = 0; step < stepCount; step++) {
            const voices = steps[step];
            for (let voice = 0; voice < voices.length; voice++) {
                const { note } = voices[voice];
                const point1 = {
                    x: position.x + step * stepWidth,
                    y: position.y + ((note - noteMin) / noteRange) * size.h,
                };
                const point2 = {
                    x: point1.x + stepWidth - 2,
                    y: point1.y,
                };
                (0, zic_node_ui_1.setColor)(currentStep === step ? style_1.color.sequencer.pattern.currentStep : style_1.color.sequencer.pattern.step);
                (0, zic_node_ui_1.drawLine)(point1, point2);
            }
        }
    }
    if (activeStep !== undefined) {
        (0, zic_node_ui_1.setColor)(style_1.color.sequencer.pattern.step);
        (0, zic_node_ui_1.drawLine)({ x: position.x + activeStep * stepWidth + stepWidth * 0.5, y: position.y }, { x: position.x + activeStep * stepWidth + stepWidth * 0.5, y: position.y + size.h - 1 });
    }
}
exports.patternPreviewNode = patternPreviewNode;
