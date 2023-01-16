import { drawFilledRect, drawLine, Point, setColor, Size } from "zic_node_ui";
import { Pattern } from "../pattern";
import { color } from "../style";

export function patternPreview(position: Point, size: Size, pattern: Pattern, playing = false) {
    setColor(playing ? color.sequencer.pattern.playing : color.sequencer.pattern.waiting);
    const stepWidth = (size.w - 2) / pattern.stepCount;
    const notes = pattern.steps.flatMap((voices) => voices.map(({ note }) => note));
    const noteMin = Math.min(...notes);
    const noteRange = Math.max(...notes) - noteMin;

    if (noteRange === 0) {
        for (let step = 0; step < pattern.stepCount; step++) {
            const voices = pattern.steps[step];
            for (let voice = 0; voice < voices.length; voice++) {
                const rect = {
                    position: {
                        x: position.x + step * stepWidth,
                        y: position.y + (size.h / 2),
                    },
                    size: {
                        w: stepWidth - 1,
                        h: 5,
                    },
                };
                drawFilledRect(rect);
            }
        }
    } else {
        for (let step = 0; step < pattern.stepCount; step++) {
            const voices = pattern.steps[step];
            for (let voice = 0; voice < voices.length; voice++) {
                const { note } = voices[voice];
                const point1 = {
                    x: position.x + step * stepWidth,
                    y: position.y + ((note - noteMin) / noteRange) * (size.h),
                };
                const point2 = {
                    x: point1.x + stepWidth - 2,
                    y: point1.y,
                };
                drawLine(point1, point2);
            }
        }
    }
}