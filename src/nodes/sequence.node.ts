import { Color, drawFilledRect, drawLine, drawRect, drawText, Point, Rect, setColor, Size } from 'zic_node_ui';
import { color, font } from '../style';
import { patternPreviewNode } from './patternPreview.node';
import { truncate } from '../util';
import { Steps } from '../sequence';

interface Props {
    trackColor: Color;
    playing: boolean;
    detune: number;
    next?: string;
    repeat: number;
    stepCount: number;
    steps: Steps;
    activeStep?: number;
    selected?: boolean;
}

export function sequenceNode(
    id: number,
    { position, size }: Rect,
    { trackColor, playing, detune, next, repeat, stepCount, steps, activeStep, selected }: Props,
): Rect {
    setColor(playing ? color.sequencer.playing : color.foreground);
    drawFilledRect({ position, size });

    drawText(
        `${id + 1}`.padStart(3, '0'),
        { x: position.x + 2, y: position.y + 1 },
        { color: trackColor, size: 10, font: font.bold },
    );

    if (next !== undefined) {
        drawText(
            `>${truncate(next, 10)}`,
            { x: position.x + 22, y: position.y + 1 },
            { color: color.sequencer.info, size: 10, font: font.regular },
        );
    }

    const text = drawText(
        `${detune < 0 ? detune : `+${detune}`} x${repeat}`,
        { x: position.x + 2, y: position.y + 13 },
        { color: color.sequencer.info, size: 10, font: font.regular },
    );

    const patternPosition = { x: position.x + 2, y: text.position.y + text.size.h + 1 };
    const patternSize = { w: size.w - 4, h: size.h - (patternPosition.y - position.y) - 4 };

    setColor(trackColor);
    drawFilledRect({ position: patternPosition, size: patternSize });
    patternPreviewNode(
        { x: patternPosition.x + 2, y: patternPosition.y + 2 },
        { w: patternSize.w - 4, h: patternSize.h - 6 },
        stepCount,
        steps,
        playing,
    );
    if (activeStep !== undefined) {
        renderActiveStep(patternPosition, size, stepCount, activeStep);
    }

    if (selected) {
        setColor(color.secondarySelected);
        drawRect({ position, size });
    }

    return { position, size };
}

function renderActiveStep(position: Point, size: Size, stepCount: number, step: number) {
    setColor(color.sequencer.pattern.playing);
    const stepWidth = (size.w - 2) / stepCount;
    drawLine(
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y },
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y + 20 },
    );
}
