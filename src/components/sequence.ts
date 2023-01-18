import {
    Color,
    drawFilledRect,
    drawLine,
    drawText,
    Point,
    Rect,
    setColor,
} from 'zic_node_ui';
import { color, font } from '../style';
import { config } from '../config';
import { Pattern } from '../pattern';
import { patternPreview } from './patternPreview';

const margin = 1;
const col = 4;
const size = { w: config.screen.size.w / col - margin, h: 49 };

interface Props {
    titleColor: Color;
    title: string;
    playing: boolean;
    detune: number;
    nextSequenceId?: number;
    repeat: number;
    pattern: Pattern;
    activeStep?: number;
}

export function sequence(
    id: number,
    {
        titleColor,
        title,
        playing,
        detune,
        nextSequenceId,
        repeat,
        pattern,
        activeStep,
    }: Props,
    scrollY = 0,
): Rect {
    setColor(playing ? color.sequencer.playing : color.foreground);
    const position = {
        x: margin + (margin + size.w) * (id % col),
        y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
    };
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
            nextSequenceId !== undefined ? ` >${nextSequenceId + 1}` : ''
        }`,
        { x: position.x + 2, y: position.y + 37 },
        { color: color.sequencer.info, size: 10, font: font.regular },
    );

    patternPreview(
        { x: position.x + 2, y: position.y + 15 },
        { w: size.w, h: size.h - 30 },
        pattern,
        playing,
    );
    if (activeStep !== undefined && playing) {
        renderActiveStep({ x: position.x + 2, y: position.y + 15 }, pattern, activeStep);
    }

    return { position, size };
}

function renderActiveStep(position: Point, pattern: Pattern, step: number) {
    setColor(color.sequencer.pattern.playing);
    const stepWidth = (size.w - 2) / pattern.stepCount;
    drawLine(
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y },
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y + 20 },
    );
}
