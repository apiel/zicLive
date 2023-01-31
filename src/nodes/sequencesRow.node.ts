import { Rect } from 'zic_node_ui';
import { unit } from '../style';
import { config } from '../config';
import { sequencesNode } from './sequences.node';

const { margin } = unit;
const height = unit.height * 2;

const sequenceWidth = config.screen.size.w / config.sequence.col - margin;

export function sequenceRect(id: number, scrollY = 0): Rect {
    const size = { w: sequenceWidth, h: height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * id,
            y: scrollY + margin,
        },
        size,
    };
}

export function sequencesRowNode(
    scrollY: number,
    onEdit: (id: number) => void,
    onSelected: (id: number) => void = () => {},
) {
    sequencesNode(scrollY, sequenceRect, onEdit, onSelected);
}
