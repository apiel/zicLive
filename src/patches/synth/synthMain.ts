import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { FilterMode, FilterNames, SynthDualOsc } from 'zic_node';
import { filterCutoffEncoder, filterResonanceEncoder, patchEncoder, volumeEncoder } from '../encoders';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';

const fId = SynthDualOsc.FloatId;

const encoders: Encoders = [
    patchEncoder,
    volumeEncoder(fId.Volume),
    undefined,
    undefined,
    filterCutoffEncoder(fId.filterCutoff),
    filterResonanceEncoder(fId.filterResonance),
    {
        title: 'Filter Type',
        getValue: () => `${FilterNames[getPatch(currentPatchId).floats[fId.filterMode]]}`,
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.filterMode,
                minmax(patch.floats[fId.filterMode] + direction, 0, FilterMode.COUNT - 1),
            );
            return true;
        },
    },
    undefined,
];

export const synthMain = {
    header: () => {
        drawText('Synth', { x: 30, y: 10 }, { size: 64, color: color.foreground3, font: font.regular });
    },
    encoders,
};
