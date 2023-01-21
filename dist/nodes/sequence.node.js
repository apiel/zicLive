import { drawFilledRect, drawLine, drawText, setColor, } from 'zic_node_ui';
import { color, font, unit } from '../style';
import { patternPreviewNode } from './patternPreview.node';
import { truncate } from '../util';
const { margin } = unit;
const height = unit.height * 2;
export function sequencePosition(id, size, col, scrollY = 0) {
    return {
        x: margin + (margin + size.w) * (id % col),
        y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
    };
}
export function sequenceRect(id, col, scrollY = 0) {
    const size = { w: unit.quarterScreen - margin, h: height - margin };
    return { position: sequencePosition(id, size, col, scrollY), size };
}
export function sequenceNode(id, col, { titleColor, title, playing, detune, next, repeat, pattern, activeStep }, scrollY = 0) {
    setColor(playing ? color.sequencer.playing : color.foreground);
    const { position, size } = sequenceRect(id, col, scrollY);
    drawFilledRect({ position, size });
    drawText(`${id + 1}`, { x: position.x + 2, y: position.y + 1 }, { color: titleColor, size: 10, font: font.bold });
    drawText(`${title}`, { x: position.x + 15, y: position.y + 1 }, { color: titleColor, size: 10, font: font.regular });
    drawText(`${detune < 0 ? detune : `+${detune}`} x${repeat}${next !== undefined ? ` >${truncate(next, 10)}` : ''}`, { x: position.x + 2, y: position.y + 37 }, { color: color.sequencer.info, size: 10, font: font.regular });
    patternPreviewNode({ x: position.x + 2, y: position.y + 15 }, { w: size.w, h: size.h - 30 }, pattern, playing);
    if (activeStep !== undefined) {
        renderActiveStep({ x: position.x + 2, y: position.y + 15 }, size, pattern, activeStep);
    }
    return { position, size };
}
function renderActiveStep(position, size, pattern, step) {
    setColor(color.sequencer.pattern.playing);
    const stepWidth = (size.w - 2) / pattern.stepCount;
    drawLine({ x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y }, { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y + 20 });
}
