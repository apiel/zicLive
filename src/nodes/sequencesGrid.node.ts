import { Rect } from 'zic_node_ui';
import { unit } from '../style';
import { config } from '../config';
import { sequencesNode } from './sequences.node';
import { sequences } from '../sequence';

const { margin } = unit;
const height = unit.height * 2;

const sequenceWidth = config.screen.size.w / config.sequence.col - margin;

export const sequenceRect = (col: number) => (id: number, scrollY = 0): Rect => {
    const size = { w: sequenceWidth, h: height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * (id % col),
            y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
        },
        size,
    };
}

export function sequencesGridNode(
    col: number,
    scrollY: number,
    onEdit: (id: number) => void,
    onSelected: (id: number) => void = () => {},
) {
    sequencesNode(sequences, scrollY, sequenceRect(col), onEdit, onSelected);
}
