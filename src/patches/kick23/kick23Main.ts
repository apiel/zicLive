import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { filterEncoders, patchEncoder, percentageEncoder, volumeEncoder } from '../encoders';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { shiftPressed } from '../../midi';

const fId = Kick23.FloatId;

const encoders: Encoders = [
    patchEncoder,
    volumeEncoder(fId.Volume),
    percentageEncoder(fId.distortion, 'Distortion'),
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.distortionRange, minmax(patch.floats[fId.distortionRange] + direction, 10, 120));
            return true;
        },
        node: {
            title: 'Distortion range',
            getValue: () => getPatch(currentPatchId).floats[fId.distortionRange].toString(),
        },
    },
    ...filterEncoders(fId.filterCutoff, fId.filterResonance),
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.Duration,
                minmax(patch.floats[fId.Duration] + direction * (shiftPressed ? 10 : 1), 10, 5000),
            );
            return true;
        },
        node: {
            title: 'Duration',
            getValue: () => getPatch(currentPatchId).floats[fId.Duration].toString(),    
            unit: 'ms (t)',
        }
    },
    undefined,
];

export const kick23Main = {
    header: () => {
        drawText('Kick 23', { x: 30, y: 10 }, { size: 64, color: color.foreground3, font: font.regular });
    },
    encoders,
};
