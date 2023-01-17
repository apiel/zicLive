import { clear, Events } from 'zic_node_ui';
import { sequence } from '../components/sequence';
import { getPattern } from '../pattern';
import { patches, presets, sequences, tracks } from '../sequencer';
import { color } from '../style';

export async function sequencerView() {
    clear(color.background);
    for (let id = 0; id < sequences.length; id++) {
        const { trackId, patchId, patternId, presetId, ...seq } = sequences[id];
        const props = {
            ...seq,
            track: tracks[trackId],
            selected: id === 2,
            pattern: getPattern(patternId),
            patch: patches[patchId],
            preset: presets[presetId],
            // activeStep: stepCounter % seqProps[id].pattern.stepCount
        }
        sequence(id, props);
    }
}

export async function sequencerEventHandler(events: Events) {
    return false;
}
