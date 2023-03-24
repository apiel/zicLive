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

const fId = Kick23.FloatId;

const encoders: Encoders = [
    {
        title: 'Mod1 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq1] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq1,
                minmax(patch.floats[fId.envFreq1] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod2 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq2] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq2,
                minmax(patch.floats[fId.envFreq2] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod3 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq3] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq3,
                minmax(patch.floats[fId.envFreq3] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod4 level',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq4] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq4,
                minmax(patch.floats[fId.envFreq4] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod1 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq1Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq1Time,
                minmax(patch.floats[fId.envFreq1Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod2 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq2Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq2Time,
                minmax(patch.floats[fId.envFreq2Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod3 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq3Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq3Time,
                minmax(patch.floats[fId.envFreq3Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
    {
        title: 'Mod4 time',
        getValue: () => Math.round(getPatch(currentPatchId).floats[fId.envFreq4Time] * 100).toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.envFreq4Time,
                minmax(patch.floats[fId.envFreq4Time] + direction * (shiftPressed ? 0.01 : 0.1), 0, 1),
            );
            return true;
        },
        unit: '%',
    },
];

export const kick23EnvFreq = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawEnvelope(graphRect, [
            [1.0, 0.0],
            [patch.floats[fId.envFreq1], patch.floats[fId.envFreq1Time]],
            [patch.floats[fId.envFreq2], patch.floats[fId.envFreq2Time]],
            [patch.floats[fId.envFreq3], patch.floats[fId.envFreq3Time]],
            [patch.floats[fId.envFreq4], patch.floats[fId.envFreq4Time]],
            [0.0, 1.0],
        ]);
        drawText('Envelope Frequency', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
