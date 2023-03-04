import { Rect } from 'zic_node_ui';
import { unit } from '../style';
import { config } from '../config';
import { sequencesNode } from './sequences.node';
import { sequences } from '../sequence';
import { SelectableOptions } from '../selector';

const { margin } = unit;
const height = unit.height * 2 - 10;

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
    getSelectableOptions: (id: number) => SelectableOptions = () => ({}),
    _sequences = sequences,
) {
    sequencesNode(_sequences, scrollY, sequenceRect(col), getSelectableOptions);
}
