import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { patchEncoder } from '../patchEncoder';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { shiftPressed } from '../../midi';

const fId = Kick23.FloatId;

const encoders: Encoders = [
    patchEncoder,
    {
        title: 'Volume',
        getValue: () => {
            const patch = getPatch(currentPatchId);
            return Math.round(patch.floats[fId.Volume] * 100).toString();
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction * (shiftPressed ? 0.1 : 0.01), 0, 1));
            return true;
        },
        unit: '%',
    },
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
    {
        title: 'Filter',
        getValue: () => getPatch(currentPatchId).floats[fId.filterCutoff].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.filterCutoff, minmax(patch.floats[fId.filterCutoff] + direction * (shiftPressed ? 100 : 10), 200, 8000));
            return true;
        },
        unit: 'hz',
    },
    {
        title: 'Resonance',
        getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId.filterResonance] * 100)}`,
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.filterResonance, minmax(patch.floats[fId.filterResonance] + direction * 0.01, 0, 1));
            return true;
        },
        unit: '%',
    },
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
