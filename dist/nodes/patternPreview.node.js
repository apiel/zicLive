"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patternPreviewNode = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const style_1 = require("../style");
function patternPreviewNode(position, size, stepCount, _steps, playing = false) {
    (0, zic_node_ui_1.setColor)(playing ? style_1.color.sequencer.pattern.playing : style_1.color.sequencer.pattern.waiting);
    const stepWidth = Math.max((size.w - 2) / stepCount, 2);
    const steps = _steps.map((voices) => voices.filter((v) => v)); // remove undefined/null
    const notes = steps.flatMap((voices) => voices.map((v) => v.note));
    const noteMin = Math.min(...notes);
    const noteRange = Math.max(...notes) - noteMin;
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
                (0, zic_node_ui_1.drawLine)(point1, point2);
            }
        }
    }
}
exports.patternPreviewNode = patternPreviewNode;
