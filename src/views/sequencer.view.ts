import { clear, Events } from 'zic_node_ui';
import { sequence } from '../components/sequence';
import { config } from '../config';
import { drawSelectableRect } from '../draw';
import { eventSelector, getEditMode } from '../events';
import { getPattern } from '../pattern';
import { cleanSelectableItems } from '../selector';
import { patches, presets, sequences, tracks } from '../sequencer';
import { color } from '../style';

let scrollY = 0;

export async function sequencerView() {
    cleanSelectableItems();
    clear(color.background);
    for (let id = 0; id < sequences.length; id++) {
        const { trackId, patchId, patternId, presetId, ...seq } = sequences[id];
        const props = {
            ...seq,
            track: tracks[trackId],
            // selected: id === 2,
            pattern: getPattern(patternId),
            patch: patches[patchId],
            preset: presets[presetId],
            // activeStep: stepCounter % seqProps[id].pattern.stepCount
        };
        drawSelectableRect(sequence(id, props, scrollY), color.sequencer.selected);
    }
}

export async function sequencerEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await sequencerView();
        return true;
    }
    const item = eventSelector(events);
    if (item) {
        if (item.position.y > config.screen.size.h - 50) {
            scrollY -= 50;
        } else if (item.position.y < 40 && scrollY < 0) {
            scrollY += 50;
        }
        await sequencerView();
        return true;
    }
    return false;
}
