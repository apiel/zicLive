import { drawFilledRect, drawLine, Rect, setColor } from 'zic_node_ui';
import { color } from '../style';
import { DrawOptions, getDrawRect } from './getDrawRect';

export function drawEnvelope(rect: Rect, envelope: [number, number][]) {
    setColor(color.foreground);
    drawFilledRect(rect);
    setColor(color.chart);
    for (let i = 0; i < envelope.length - 1; i++) {
        const [value1, time1] = envelope[i];
        const [value2, time2] = envelope[i + 1];
        drawLine(
            {
                x: rect.position.x + time1 * rect.size.w,
                y: rect.position.y + (1 - value1) * rect.size.h,
            },
            {
                x: rect.position.x + time2 * rect.size.w,
                y: rect.position.y + (1 - value2) * rect.size.h,
            },
        );
    }
}

export function drawEnvelope2(envelope: [number, number][], options: DrawOptions = {}) {
    drawFilledRect(getDrawRect(options));
}
