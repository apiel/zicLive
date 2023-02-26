import { Rect } from 'zic_node_ui';
import { unit } from '../style';
import { config } from '../config';
import { SequenceNoteOptions, sequencesNode } from './sequences.node';
import { sequences } from '../sequence';
import { SelectableOptions } from '../selector';

const { margin } = unit;
export const height = unit.height * 2;

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
    getSelectableOptions: (id: number) => SelectableOptions = () => ({}),
    _sequences = sequences,
    options: SequenceNoteOptions,
) {
    sequencesNode(_sequences, scrollY, sequenceRect, getSelectableOptions, options);
}
