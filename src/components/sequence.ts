import { drawFilledRect, setColor } from 'zic_node_ui';
import { color } from '../style';
import { config } from '../config';

const windowPadding = 2;
const margin = 1;
const col = 4;
const size = { w: (config.screen.size.w - windowPadding) / col - margin, h: 60 };

export function sequence(id: number) {
    setColor(color.foreground);

    drawFilledRect({
        position: {
            x: windowPadding + (margin + size.w) * (id % col),
            y: windowPadding + (margin + size.h) * Math.floor(id / col),
        },
        size,
    });
}
