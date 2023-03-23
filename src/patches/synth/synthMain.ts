import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { filterCutoffEncoder, filterResonanceEncoder, patchEncoder, volumeEncoder } from '../encoders';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { shiftPressed } from '../../midi';

const fId = SynthDualOsc.FloatId;

const encoders: Encoders = [
    patchEncoder,
    volumeEncoder(fId.Volume),
    // {
    //     title: 'Distortion',
    //     getValue: () => getPatch(currentPatchId).floats[fId.distortion].toString(),
    //     handler: async (direction) => {
    //         const patch = getPatch(currentPatchId);
    //         patch.setNumber(fId.distortion, minmax(patch.floats[fId.distortion] + direction, 0, 100));
    //         return true;
    //     },
    //     unit: '%',
    // },
    undefined,
    undefined,
    filterCutoffEncoder(fId.filterCutoff),
    filterResonanceEncoder(fId.filterResonance),
    undefined,
    undefined,
];

export const synthMain = {
    header: () => {
        drawText('Synth', { x: 30, y: 10 }, { size: 64, color: color.foreground3, font: font.regular });
    },
    encoders,
};
