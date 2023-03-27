import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { FilterMode, FilterNames, SynthDualOsc } from 'zic_node';
import { filterEncoders, patchEncoder, volumeEncoder } from '../encoders';
import { drawPatchTitle } from '../draw';

const fId = SynthDualOsc.FloatId;

const encoders: Encoders = [
    patchEncoder,
    volumeEncoder(fId.Volume),
    undefined,
    undefined,
    ...filterEncoders(fId.filterCutoff, fId.filterResonance),
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.filterMode, minmax(patch.floats[fId.filterMode] + direction, 0, FilterMode.COUNT - 1));
            return true;
        },
        node: {
            title: 'Filter Type',
            getValue: () => `${FilterNames[getPatch(currentPatchId).floats[fId.filterMode]]}`,
        },
    },
    undefined,
];

export const synthMain = {
    header: () => {
        drawPatchTitle('Synth');
    },
    encoders,
};
