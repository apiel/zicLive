import { drawFilledRect, drawText, Point, Rect, setColor, Size } from 'zic_node_ui';
import { sequenceNode } from './sequence.node';
import { drawSelectableRect } from '../draw/drawSelectable';
import { getPatch } from '../patch';
import { getPattern } from '../pattern';
import { newSequence, sequences } from '../sequence';
import { color, font, unit } from '../style';
import { getTrack, getTrackColor } from '../track';
import { config } from '../config';

const { margin } = unit;
const height = unit.height * 2;

function sequencePosition(id: number, size: Size, col: number, scrollY = 0): Point {
    return {
        x: margin + (margin + size.w) * (id % col),
        y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
    };
}

const sequenceWidth = config.screen.size.w / config.sequence.col - margin;

export function sequenceRect(id: number, col: number, scrollY = 0): Rect {
    const size = { w: sequenceWidth, h: height - margin };
    return { position: sequencePosition(id, size, col, scrollY), size };
}

export function sequencesGridNode(
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
        const rect = sequenceRect(id, col, scrollY);
        sequenceNode(id, rect, props);
        drawSelectableRect(rect, color.sequencer.selected, {
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
