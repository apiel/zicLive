import { PatchViewData } from '../PatchViewData';
import { kick23EnvAmp } from './kick23EnvAmp';
import { kick23EnvFreq } from './kick23EnvFreq';
import { kick23Main } from './kick23Main';
import { kick23Wavetable } from './kick23Wavetable';

export const kick23 = new PatchViewData([kick23Main, kick23Wavetable, kick23EnvAmp, kick23EnvFreq]);
