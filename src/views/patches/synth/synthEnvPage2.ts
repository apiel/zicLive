import { Encoders } from '../../../layout/encoders.layout';
import { SynthDualOsc } from 'zic_node';
import { percentageEncoder } from '../encoders';
import { header } from './synthEnv';
import { color } from '../../../style';

const fId = SynthDualOsc.FloatId;

const encoders: Encoders = [
    percentageEncoder(fId.envModCutoff, 'Filter Cutoff Mod.', { bgColor: color.encoder[1] }),
    percentageEncoder(fId.envModPitch, 'Osc1 Frequency Mod.'),
    percentageEncoder(fId.envModAmplitude, 'Osc1 Amplitude Mod.'),
    percentageEncoder(fId.envModMorph, 'Osc1 Morph Mod.'),
    percentageEncoder(fId.envModResonance, 'Filter Resonance Mod.', { bgColor: color.encoder[1] }),
    percentageEncoder(fId.envModPitch2, 'Osc2 Frequency Mod.', { bgColor: color.encoder[2] }),
    percentageEncoder(fId.envModAmplitude2, 'Osc2 Amplitude Mod.', { bgColor: color.encoder[2] }),
    percentageEncoder(fId.envModMorph2, 'Osc2 Morph Mod.', { bgColor: color.encoder[2] }),
];

export const synthEnvPage2 = {
    header: header(2),
    encoders,
};
