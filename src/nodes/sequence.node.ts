import { Color, drawFilledRect, drawLine, drawRect, drawText, Point, Rect, setColor, Size } from 'zic_node_ui';
import { color, font } from '../style';
import { Pattern } from '../pattern';
import { patternPreviewNode } from './patternPreview.node';
import { truncate } from '../util';

interface Props {
    titleColor: Color;
    title: string;
    playing: boolean;
    detune: number;
    next?: string;
    repeat: number;
    pattern: Pattern;
    activeStep?: number;
    selected?: boolean;
}

export function sequenceNode(
    id: number,
    { position, size }: Rect,
    { titleColor, title, playing, detune, next, repeat, pattern, activeStep, selected }: Props,
): Rect {
    setColor(playing ? color.sequencer.playing : color.foreground);
    drawFilledRect({ position, size });

    drawText(`${id + 1}`, { x: position.x + 2, y: position.y + 1 }, { color: titleColor, size: 10, font: font.bold });

    drawText(
        `${title}`,
        { x: position.x + 15, y: position.y + 1 },
        { color: titleColor, size: 10, font: font.regular },
    );

    drawText(
        `${detune < 0 ? detune : `+${detune}`} x${repeat}${next !== undefined ? ` >${truncate(next, 10)}` : ''}`,
        { x: position.x + 2, y: position.y + 37 },
        { color: color.sequencer.info, size: 10, font: font.regular },
    );

    patternPreviewNode({ x: position.x + 2, y: position.y + 15 }, { w: size.w, h: size.h - 30 }, pattern, playing);
    if (activeStep !== undefined) {
        renderActiveStep({ x: position.x + 2, y: position.y + 15 }, size, pattern, activeStep);
    }

    if (selected) {
        setColor(color.secondarySelected);
        drawRect({ position, size });
    }

    return { position, size };
}

function renderActiveStep(position: Point, size: Size, pattern: Pattern, step: number) {
    setColor(color.sequencer.pattern.playing);
    const stepWidth = (size.w - 2) / pattern.stepCount;
    drawLine(
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y },
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y + 20 },
    );
}
