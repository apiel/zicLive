import { PatchViewData } from '../PatchViewData';
import { synthMain } from './synthMain';
import { synthOsc1 } from './synthOsc1';
import { synthOsc2Lfo } from './synthOsc2Lfo';

export const synth = new PatchViewData([synthMain, synthOsc1, synthOsc2Lfo]);
