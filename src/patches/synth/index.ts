import { PatchViewData } from '../PatchViewData';
import { synthEnv } from './synthEnv';
import { synthMain } from './synthMain';
import { synthOsc1 } from './synthOsc1';
import { synthOsc2Lfo } from './synthOsc2Lfo';
import { synthOsc2LfoPage2 } from './synthOsc2LfoPage2';

export const synth = new PatchViewData([synthMain, synthOsc1, synthOsc2Lfo, synthOsc2LfoPage2, synthEnv]);
