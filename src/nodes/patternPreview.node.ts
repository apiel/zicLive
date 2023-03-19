import { drawFilledRect, drawLine, Rect, setColor } from 'zic_node_ui';
import { Steps } from '../sequence';
import { color } from '../style';

export function patternPreviewNode(
    { position, size }: Rect,
    stepCount: number,
    _steps: Steps,
    activeStep?: number,
    currentStep?: number,
) {
    const stepWidth = Math.max((size.w - 2) / stepCount, 2);
    const steps = _steps.map((voices) => voices.filter((v) => v)); // remove undefined/null
    const notes = steps.flatMap((voices) => voices.map((v) => v!.note));
    const noteMin = Math.min(...notes);
    const noteRange = Math.max(...notes) - noteMin;

    if (currentStep !== undefined) {
        setColor(color.foreground2);
        drawFilledRect({
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
                setColor(currentStep === step ? color.sequencer.pattern.currentStep : color.sequencer.pattern.step);
                drawFilledRect(rect);
            }
        }
    } else {
        for (let step = 0; step < stepCount; step++) {
            const voices = steps[step];
            for (let voice = 0; voice < voices.length; voice++) {
                const { note } = voices[voice]!;
                const point1 = {
                    x: position.x + step * stepWidth,
                    y: position.y + ((note - noteMin) / noteRange) * size.h,
                };
                const point2 = {
                    x: point1.x + stepWidth - 2,
                    y: point1.y,
                };
                setColor(currentStep === step ? color.sequencer.pattern.currentStep : color.sequencer.pattern.step);
                drawLine(point1, point2);
            }
        }
    }

    if (activeStep !== undefined) {
        setColor(color.sequencer.pattern.step);
        drawLine(
            { x: position.x + activeStep * stepWidth + stepWidth * 0.5, y: position.y },
            { x: position.x + activeStep * stepWidth + stepWidth * 0.5, y: position.y + size.h - 1 },
        );
    }
}
