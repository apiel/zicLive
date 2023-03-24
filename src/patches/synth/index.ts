import { PatchViewData } from '../PatchViewData';
import { synthMain } from './synthMain';
import { synthOsc1 } from './synthOsc1';

export const synth = new PatchViewData([synthMain, synthOsc1]);
