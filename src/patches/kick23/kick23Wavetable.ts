import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { graphRect } from '../graphRect';
import { wavetableEncoders } from '../encoders';
import { PatchWavetable } from '../PatchWavetable';

const fId = Kick23.FloatId;
const sId = Kick23.StringId;

const patchWavetable = new PatchWavetable(sId.Wavetable, fId.Morph);

const encoders: Encoders = [
    ...wavetableEncoders(sId.Wavetable, fId.Morph, fId.Frequency, patchWavetable),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
];

export const kick23Wavetable = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, patchWavetable.get(patch).data);
        drawText('Wavetable oscillator', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
