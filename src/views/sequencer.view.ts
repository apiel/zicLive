import { clear, Events } from 'zic_node_ui';
import { sequence } from '../components/sequence';
import { getPattern } from '../pattern';
import { patches, presets, sequences, tracks } from '../sequencer';
import { color } from '../style';

export async function sequencerView() {
    clear(color.background);
    for (let id = 0; id < sequences.length; id++) {
        const seq = sequences[id];
        const props = {
            track: tracks[seq.trackId],
            selected: id === 2,
            playing: seq.playing,
            detune: seq.detune,
            repeat: seq.repeat,
            pattern: getPattern(id),
            nextSequenceId: seq.nextSequenceId,
            patch: patches[seq.patchId],
            preset: presets[seq.presetId],
            // activeStep: stepCounter % seqProps[id].pattern.stepCount
        }
        sequence(id, props);
    }
}

export async function sequencerEventHandler(events: Events) {
    return false;
}
