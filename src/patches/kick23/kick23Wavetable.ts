import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';

const fId = Kick23.FloatId;

const encoders: Encoders = [
    {
        title: 'Volume',
        getValue: () => {
            const patch = getPatch(currentPatchId);
            return Math.round(patch.floats[fId.Volume] * 100).toString();
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction * 0.01, 0, 1));
            return true;
        },
        unit: '%',
    },
    {
        title: 'Volume',
        getValue: () => {
            const patch = getPatch(currentPatchId);
            return Math.round(patch.floats[fId.Volume] * 100).toString();
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction * 0.01, 0, 1));
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
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
];

export const kick23Wavetable = {
    header: () => {
        drawText('Kick 23 wavetable', { x: 30, y: 10 }, { size: 64, color: color.foreground3, font: font.regular });
    },
    encoders,
};
