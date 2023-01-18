import {
    Color,
    drawFilledRect,
    drawLine,
    drawText,
    Point,
    Rect,
    setColor,
    Size,
} from 'zic_node_ui';
import { color, font } from '../style';
import { Pattern } from '../pattern';
import { patternPreviewNode } from './patternPreview.node';
import { truncate } from '../util';

export const margin = 1;
export const height = 49;

export function sequencePosition(id: number, size: Size, col: number, scrollY = 0): Point {
    return {
        x: margin + (margin + size.w) * (id % col),
        y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
    };
}

export function sequenceRect(id: number, width: number, col: number, scrollY = 0): Rect {
    const size = { w: width - margin, h: height };
    return { position: sequencePosition(id, size, col, scrollY), size };
}

interface Props {
    titleColor: Color;
    title: string;
    playing: boolean;
    detune: number;
    next?: string;
    repeat: number;
    pattern: Pattern;
    activeStep?: number;
}

export function sequenceNode(
    id: number,
    width: number,
    col: number,
    { titleColor, title, playing, detune, next, repeat, pattern, activeStep }: Props,
    scrollY = 0,
): Rect {
    setColor(playing ? color.sequencer.playing : color.foreground);
    const { position, size } = sequenceRect(id, width, col, scrollY);
    drawFilledRect({ position, size });

    drawText(
        `${id + 1}`,
        { x: position.x + 2, y: position.y + 1 },
        { color: titleColor, size: 10, font: font.bold },
    );

    drawText(
        `${title}`,
        { x: position.x + 15, y: position.y + 1 },
        { color: titleColor, size: 10, font: font.regular },
    );

    drawText(
        `${detune < 0 ? detune : `+${detune}`} x${repeat}${
            next !== undefined ? ` >${truncate(next, 10)}` : ''
        }`,
        { x: position.x + 2, y: position.y + 37 },
        { color: color.sequencer.info, size: 10, font: font.regular },
    );

    patternPreviewNode(
        { x: position.x + 2, y: position.y + 15 },
        { w: size.w, h: size.h - 30 },
        pattern,
        playing,
    );
    if (activeStep !== undefined && playing) {
        renderActiveStep({ x: position.x + 2, y: position.y + 15 }, size, pattern, activeStep);
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
