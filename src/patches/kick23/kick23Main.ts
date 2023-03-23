import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { filterCutoffEncoder, filterResonanceEncoder, patchEncoder, volumeEncoder } from '../encoders';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { shiftPressed } from '../../midi';

const fId = Kick23.FloatId;

const encoders: Encoders = [
    patchEncoder,
    volumeEncoder(fId.Volume),
    {
        title: 'Distortion',
        getValue: () => getPatch(currentPatchId).floats[fId.distortion].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.distortion, minmax(patch.floats[fId.distortion] + direction, 0, 100));
            return true;
        },
        unit: '%',
    },
    {
        title: 'Distortion range',
        getValue: () => getPatch(currentPatchId).floats[fId.distortionRange].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.distortionRange, minmax(patch.floats[fId.distortionRange] + direction, 10, 120));
            return true;
        },
    },
    filterCutoffEncoder(fId.filterCutoff),
    filterResonanceEncoder(fId.filterResonance),
    {
        title: 'Duration',
        getValue: () => getPatch(currentPatchId).floats[fId.Duration].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Duration, minmax(patch.floats[fId.Duration] + direction * (shiftPressed ? 10 : 1), 10, 5000));
            return true;
        },
        unit: 'ms (t)',
    },
    undefined,
];

export const kick23Main = {
    header: () => {
        drawText('Kick 23', { x: 30, y: 10 }, { size: 64, color: color.foreground3, font: font.regular });
    },
    encoders,
};
