import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch, Patch } from '../../patch';
import { getWavetable, Kick23, Wavetable } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import path from 'path';
import { getNextWaveTable } from '../../helpers/getNextWavetable';
import { drawWavetable, drawWavetable2 } from '../../draw/drawWavetable';
import { config } from '../../config';
import { kick23GraphRect } from './kick23GraphRect';
import { shiftPressed } from '../../midi';
import { drawEnvelope, drawEnvelope2 } from '../../draw/drawEnvelope';

// TODO add one more step envelope

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
    undefined,
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
    undefined,
];

export const kick23EnvAmp = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawEnvelope(kick23GraphRect, [
            [0, 0],
            [1, 0.01], // Force to have a very short ramp up to avoid clicks
            [patch.floats[fId.envAmp1], patch.floats[fId.envAmp1Time]],
            [patch.floats[fId.envAmp2], patch.floats[fId.envAmp2Time]],
            [patch.floats[fId.envAmp3], patch.floats[fId.envAmp3Time]],
            [0.0, 1.0],
        ]);
        drawText('Envelope Amplitude', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
