import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch, Patch } from '../../patch';
import { getWavetable, SynthDualOsc, Wavetable } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import path from 'path';
import { getNextWaveTable } from '../../helpers/getNextWavetable';
import { drawWavetable } from '../../draw/drawWavetable';
import { graphRect } from '../graphRect';
import { shiftPressed } from '../../midi';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

let wavetable: Wavetable;
let lastWavetable = '';
let lastMorph = 0;
function getPatchWavetable(patch: Patch) {
    if (patch.strings[sId.oscWavetable] !== lastWavetable || patch.floats[fId.OscMorph] !== lastMorph) {
        lastWavetable = patch.strings[sId.oscWavetable];
        lastMorph = patch.floats[fId.OscMorph];
        wavetable = getWavetable(lastWavetable, lastMorph);
    }
    return wavetable;
}

const encoders: Encoders = [
    {
        title: 'Wavetable',
        getValue: () => path.parse(getPatch(currentPatchId).strings[sId.oscWavetable]).name,
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setString(sId.oscWavetable, await getNextWaveTable(direction, patch.strings[sId.oscWavetable]));
            return true;
        },
    },
    {
        title: 'Morph',
        getValue() {
            const patch = getPatch(currentPatchId);
            return patch.floats[fId.OscMorph].toFixed(1);
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.OscMorph, minmax(patch.floats[fId.OscMorph] + direction * (shiftPressed ? 1 : 0.1), 0, 64));
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
        getValue: () => getPatch(currentPatchId).floats[fId.OscFrequency].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.OscFrequency,
                minmax(patch.floats[fId.OscFrequency] + direction * (shiftPressed ? 10 : 1), 10, 2000),
            );
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

export const synthOsc1 = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, getPatchWavetable(patch).data);
        drawText('Oscillator 1', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
