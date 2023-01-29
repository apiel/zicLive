import { drawFilledRect, drawText, setColor } from 'zic_node_ui';
import { sequenceNode, sequenceRect } from './sequence.node';
import { drawSelectableRect } from '../draw/drawSelectable';
import { getPatch } from '../patch';
import { getPattern } from '../pattern';
import { newSequence, sequences } from '../sequence';
import { color, font } from '../style';
import { getTrack, getTrackColor } from '../track';

export function sequencerNode(
    col: number,
    scrollY: number,
    onEdit: (id: number) => void,
    onSelected: (id: number) => void = () => {},
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
        drawSelectableRect(sequenceNode(id, col, props, scrollY), color.sequencer.selected, {
            edit: () => onEdit(id),
            onSelected: () => onSelected(id),
        });
    }
    const addRect = sequenceRect(sequences.length, col, scrollY);
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
