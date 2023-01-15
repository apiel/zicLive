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
    detune: number;
    nextSequenceId?: number;
    repeat: number;
    patternId: number;
    pattern: [];
}

export function sequence(id: number, props: Props) {
    setColor(props.playing ? color.sequencer.playing : color.foreground);
    const position = {
        x: windowPadding + (margin + size.w) * (id % col),
        y: windowPadding + (margin + size.h) * Math.floor(id / col),
    };
    drawFilledRect({ position, size });

    if (props.selected) {
        setColor(color.sequencer.selected);
        drawRect({ position, size });
    }

    // setColor(props.playing ? color.sequencer.pattern.playing : color.sequencer.pattern.waiting);
    // const patternRect = { position :{...position}, size: {...size} };
    // patternRect.position.y += 15;
    // patternRect.size.h -= 15;
    // drawFilledRect(patternRect);

    drawText(
        `${id + 1}`,
        { x: position.x + 2, y: position.y + 1 },
        { color: color.tracks[props.track], size: 10, font: font.bold },
    );
}
