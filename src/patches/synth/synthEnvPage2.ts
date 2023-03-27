import { Encoders } from '../../layout/encoders.layout';
import { SynthDualOsc } from 'zic_node';
import { percentageEncoder } from '../encoders';
import { header } from './synthEnv';

const fId = SynthDualOsc.FloatId;

const encoders: Encoders = [
    percentageEncoder(fId.envModCutoff, 'Filter Cutoff Mod.'),
    percentageEncoder(fId.envModPitch, 'Osc1 Frequency Mod.'),
    percentageEncoder(fId.envModAmplitude, 'Osc1 Amplitude Mod.'),
    percentageEncoder(fId.envModMorph, 'Osc1 Morph Mod.'),
    percentageEncoder(fId.envModResonance, 'Filter Resonance Mod.'),
    percentageEncoder(fId.envModPitch2, 'Osc2 Frequency Mod.'),
    percentageEncoder(fId.envModAmplitude2, 'Osc2 Amplitude Mod.'),
    percentageEncoder(fId.envModMorph2, 'Osc2 Morph Mod.'),
];

export const synthEnvPage2 = {
    header: header(2),
    encoders,
};
