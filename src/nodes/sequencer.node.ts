import { drawFilledRect, drawText, setColor } from 'zic_node_ui';
import { sequenceNode, sequenceRect } from './sequence.node';
import { drawSelectableRect } from '../draw';
import { getPreset } from '../patch';
import { getPattern } from '../pattern';
import { sequences } from '../sequence';
import { color, font } from '../style';
import { getTrack, getTrackColor } from '../track';

export function sequencerNode(width: number, col: number, scrollY: number, onSelect: (id: number) => void) {
    
    for (let id = 0; id < sequences.length; id++) {
        const { trackId, patchId, presetId, patternId, nextSequenceId, ...seq } = sequences[id];
        let next;
        if (nextSequenceId !== undefined) {
            // const nextSeq = sequences[nextSequenceId];
            // next = `${seq.nextSequenceId} ${getPreset(nextSeq.patchId, nextSeq.presetId).name}`;
            next = nextSequenceId.toString();
        }
        const track = getTrack(trackId);
        const props = {
            ...seq,
            titleColor: getTrackColor(trackId),
            title: getPreset(track.type, patchId, presetId).name,
            pattern: getPattern(patternId),
            next,
            // activeStep: stepCounter % seqProps[id].pattern.stepCount
        };
        drawSelectableRect(
            sequenceNode(id, width, col, props, scrollY),
            color.sequencer.selected,
            () => { 
                onSelect(id); 
            },
        );
    }
    const addRect = sequenceRect(sequences.length, width, col, scrollY);
    setColor(color.foreground);
    drawFilledRect(addRect);
    drawSelectableRect(addRect, color.sequencer.selected, () => console.log('add sequence'));
    drawText(
        `+`,
        { x: addRect.position.x + 40, y: addRect.position.y },
        { color: color.info, size: 40, font: font.bold },
    );
}
