import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { graphRect } from '../graphRect';
import { shiftPressed } from '../../midi';
import { drawEnvelope } from '../../draw/drawEnvelope';

// TODO add one more step envelope
// TODO forbid to set time before the previous one

const fId = Kick23.FloatId;

const encoders: Encoders = [
    {
        title: 'Mod1 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp1] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp1,
                minmax(patch.floats[fId.envAmp1] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod2 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp2] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp2,
                minmax(patch.floats[fId.envAmp2] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod3 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp3] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp3,
                minmax(patch.floats[fId.envAmp3] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod4 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp4] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp4,
                minmax(patch.floats[fId.envAmp4] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod1 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp1Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp1Time,
                minmax(patch.floats[fId.envAmp1Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod2 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp2Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp2Time,
                minmax(patch.floats[fId.envAmp2Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod3 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp3Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp3Time,
                minmax(patch.floats[fId.envAmp3Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod4 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envAmp4Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envAmp4Time,
                minmax(patch.floats[fId.envAmp4Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
];

export const kick23EnvAmp = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawEnvelope(graphRect, [
            [0, 0],
            [1, 0.01], // Force to have a very short ramp up to avoid clicks
            [patch.floats[fId.envAmp1], patch.floats[fId.envAmp1Time]],
            [patch.floats[fId.envAmp2], patch.floats[fId.envAmp2Time]],
            [patch.floats[fId.envAmp3], patch.floats[fId.envAmp3Time]],
            [patch.floats[fId.envAmp4], patch.floats[fId.envAmp4Time]],
            [0.0, 1.0],
        ]);
        drawText('Envelope Amplitude', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
