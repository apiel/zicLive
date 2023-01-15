import { drawFilledRect, drawRect, drawText, setColor } from 'zic_node_ui';
import { color, font } from '../style';
import { config } from '../config';

const windowPadding = 1;
const margin = 1;
const col = 4;
const size = { w: config.screen.size.w / col - margin, h: 40 };

interface Props {
    track: number;
    selected: boolean;
    playing: boolean;
}

export function sequence(id: number, props: Props) {
    setColor(color.foreground);
    const position = {
        x: windowPadding + (margin + size.w) * (id % col),
        y: windowPadding + (margin + size.h) * Math.floor(id / col),
    };
    drawFilledRect({ position, size });

    if (props.selected) {
        setColor(color.sequencer.selected);
        drawRect({ position, size });
    }

    drawText(
        `${id + 1}`,
        { x: position.x + 2, y: position.y + 1 },
        { color: color.tracks[props.track], size: 10, font: font.bold },
    );
}
