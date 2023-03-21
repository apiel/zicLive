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

const fId = Kick23.FloatId;
const sId = Kick23.StringId;

let wavetable: Wavetable;
let lastWavetable = '';
let lastMorph = 0;
function getPatchWavetable(patch: Patch) {
    if (patch.strings[sId.Wavetable] !== lastWavetable || patch.floats[fId.Morph] !== lastMorph) {
        lastWavetable = patch.strings[sId.Wavetable];
        lastMorph = patch.floats[fId.Morph];
        wavetable = getWavetable(lastWavetable, lastMorph);
    }
    return wavetable;
}

const encoders: Encoders = [
    {
        title: 'Wavetable',
        getValue: () => path.parse(getPatch(currentPatchId).strings[sId.Wavetable]).name,
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setString(sId.Wavetable, await getNextWaveTable(direction, patch.strings[sId.Wavetable]));
            return true;
        },
    },
    {
        title: 'Morph',
        getValue() {
            const patch = getPatch(currentPatchId);
            return patch.floats[fId.Morph].toFixed(1);
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Morph, minmax(patch.floats[fId.Morph] + direction * 0.1, 0, 64));
            return true;
        },
        unit() {
            const patch = getPatch(currentPatchId);
            return `/${getPatchWavetable(patch).wavetableCount}`;
        },
        info() {
            const patch = getPatch(currentPatchId);
            return `${getPatchWavetable(patch).wavetableSampleCount} samples`;
        },
    },
    {
        title: 'Frequency',
        getValue: () => getPatch(currentPatchId).floats[fId.Frequency].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Frequency, minmax(patch.floats[fId.Frequency] + direction, 10, 2000));
            return true;
        },
        unit: 'hz',
    },
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
];

export const kick23Wavetable = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(kick23GraphRect, getPatchWavetable(patch).data);
    },
    encoders,
};
