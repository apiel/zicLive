import { drawFilledRect, drawLine, Point, Rect, setColor } from 'zic_node_ui';
import { color } from '../style';
import { DrawOptions, getDrawRect } from './getDrawRect';

export function drawWavetable(rect: Rect, wavetable: number[]) {
    setColor(color.foreground);
    drawFilledRect(rect);
    setColor(color.chart);
    const f = wavetable.length / rect.size.w;
    let prevPoint: Point | undefined;
    for (let i = 0; i < rect.size.w; i++) {
        const sample = wavetable[Math.round(i * f)];
        // drawPoint({
        //     x: rect.position.x + i,
        //     y: rect.position.y + (rect.size.h - sample * rect.size.h) * 0.5,
        // });
        const point = {
            x: rect.position.x + i,
            y: rect.position.y + (rect.size.h - sample * rect.size.h) * 0.5,
        };
        if (prevPoint) {
            drawLine(prevPoint, point);
        }
        prevPoint = point;
    }
}

export function drawWavetable2(wavetable: number[], options: DrawOptions = {}) {
    drawWavetable(getDrawRect(options), wavetable);
}
