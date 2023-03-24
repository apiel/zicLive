import { getWavetable, Wavetable } from 'zic_node';
import { Patch } from '../patch';

export class PatchWavetable {
    wavetable!: Wavetable;
    lastWavetable = '';
    lastMorph = -1;

    constructor(protected sIdWavteable: number, protected fIdMorph: number) {}

    get(patch: Patch) {
        if (patch.strings[this.sIdWavteable] !== this.lastWavetable || patch.floats[this.fIdMorph] !== this.lastMorph) {
            this.lastWavetable = patch.strings[this.sIdWavteable];
            this.lastMorph = patch.floats[this.fIdMorph];
            this.wavetable = getWavetable(this.lastWavetable, this.lastMorph);
        }
        return this.wavetable;
    }
}
