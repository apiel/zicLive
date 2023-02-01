import { drawFilledRect, drawText, Rect, setColor } from 'zic_node_ui';
import { sequenceNode } from './sequence.node';
import { drawSelectableRect } from '../draw/drawSelectable';
import { getPatch } from '../patch';
import { getPattern } from '../pattern';
import { newSequence, Sequence } from '../sequence';
import { color, font } from '../style';
import { getTrack, getTrackColor } from '../track';
import { SelectableOptions } from '../selector';

export function sequencesNode(
    sequences: Sequence[],
    scrollY: number,
    sequenceRect: (id: number, scrollY: number) => Rect,
    getSelectableOptions: (id: number) => SelectableOptions = () => ({}),
) {
    for (let id = 0; id < sequences.length; id++) {
        const { trackId, patchId, patternId, nextSequenceId, ...seq } = sequences[id];
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
            pattern: getPattern(patternId),
            next,
        };
        const rect = sequenceRect(id, scrollY);
        sequenceNode(id, rect, props);
        drawSelectableRect(rect, color.sequencer.selected, getSelectableOptions(id));
    }
    const addRect = sequenceRect(sequences.length, scrollY);
    setColor(color.foreground);
    drawFilledRect(addRect);
    drawSelectableRect(addRect, color.sequencer.selected, {
        edit: newSequence,
    });
    drawText(
        `+`,
        { x: addRect.position.x - 10 + addRect.size.w / 2, y: addRect.position.y },
        { color: color.info, size: 40, font: font.bold },
    );
}
