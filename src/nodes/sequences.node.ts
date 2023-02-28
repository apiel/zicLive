import { drawFilledRect, drawText, Rect, setColor } from 'zic_node_ui';
import { sequenceNode } from './sequence.node';
import { drawSelectableRect } from '../draw/drawSelectable';
import { getPatch } from '../patch';
import { newSequence, Sequence } from '../sequence';
import { color, font } from '../style';
import { getTrack, getTrackColor } from '../track';
import { SelectableOptions } from '../selector';

export interface SequenceNoteOptions {
    selectedId?: number;
}

export function sequencesNode(
    sequences: Sequence[],
    scrollY: number,
    sequenceRect: (id: number, scrollY: number) => Rect,
    getSelectableOptions: (id: number) => SelectableOptions = () => ({}),
    { selectedId }: SequenceNoteOptions = { selectedId: -1 },
) {
    for (let i = 0; i < sequences.length; i++) {
        const { id, trackId, patchId, nextSequenceId, ...seq } = sequences[i];
        let next;
        if (nextSequenceId !== undefined) {
            // const nextSeq = sequences[nextSequenceId];
            // next = `${seq.nextSequenceId} ${getPatch(nextSeq.patchId).name}`;
            next = nextSequenceId.toString();
        }
        const track = getTrack(trackId);
        const props = {
            ...seq,
            titleColor: getTrackColor(trackId),
            title: getPatch(track.engine, patchId).name,
            next,
            selected: selectedId === id,
        };
        const rect = sequenceRect(i, scrollY);
        sequenceNode(id, rect, props);
        drawSelectableRect(rect, color.sequencer.selected, getSelectableOptions(id));
    }
    const addRect = sequenceRect(sequences.length, scrollY);
    setColor(color.foreground);
    drawFilledRect(addRect);

    drawSelectableRect(addRect, color.sequencer.selected, {
        ...getSelectableOptions(-1),
        edit: newSequence,
    });
    drawText(
        `+`,
        { x: addRect.position.x - 10 + addRect.size.w / 2, y: addRect.position.y },
        { color: color.info, size: 40, font: font.bold },
    );
}
