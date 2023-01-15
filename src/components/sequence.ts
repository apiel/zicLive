import { drawFilledRect, drawText, setColor } from 'zic_node_ui';
import { color } from '../style';
import { config } from '../config';

const windowPadding = 1;
const margin = 1;
const col = 4;
const size = { w: config.screen.size.w / col - margin, h: 40 };

export function sequence(id: number) {
    setColor(color.foreground);
    const position = {
        x: windowPadding + (margin + size.w) * (id % col),
        y: windowPadding + (margin + size.h) * Math.floor(id / col),
    };
    drawFilledRect({ position, size });

    setColor(color.tracks[id % 5]);
    drawFilledRect({ position: { x: position.x + 2, y: position.y + 2 }, size: { w: 14, h: 12 } });
    drawText(`${id + 1}`, { x: position.x + 2, y: position.y + 1 }, { color: color.white, size: 10 });
}
