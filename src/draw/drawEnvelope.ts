import { Color, drawFilledRect, drawLine, Rect, setColor } from 'zic_node_ui';
import { color } from '../style';
import { DrawOptions, getDrawRect } from './getDrawRect';

export function drawEnvelope(
    rect: Rect,
    envelope: ([number, number] | [number, number, Color] | [number, number, Color | undefined, Color])[],
) {
    setColor(color.foreground);
    drawFilledRect(rect);
    for (let i = 0; i < envelope.length - 1; i++) {
        const [value1, time1, pointColor, lineColor] = envelope[i];
        const [value2, time2] = envelope[i + 1];
        const point1 = {
            x: rect.position.x + time1 * rect.size.w,
            y: rect.position.y + (1 - value1) * rect.size.h,
        };
        setColor(lineColor ?? color.chart);
        drawLine(point1, {
            x: rect.position.x + time2 * rect.size.w,
            y: rect.position.y + (1 - value2) * rect.size.h,
        });
        if (pointColor !== undefined) {
            setColor(pointColor);
            drawFilledRect({ position: { x: point1.x - 2, y: point1.y - 2 }, size: { w: 4, h: 4 } });
        }
    }
}

export function drawEnvelope2(envelope: [number, number][], options: DrawOptions = {}) {
    drawFilledRect(getDrawRect(options));
}
