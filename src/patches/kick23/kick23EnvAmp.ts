import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { graphRect } from '../graphRect';
import { drawEnvelope } from '../../draw/drawEnvelope';
import { modLevelEncoder, modTimeEncoder } from '../encoders';

// TODO forbid to set time before the previous one

const fId = Kick23.FloatId;

const encoders: Encoders = [
    modLevelEncoder(fId.envAmp1, 1),
    modLevelEncoder(fId.envAmp2, 2),
    modLevelEncoder(fId.envAmp3, 3),
    modLevelEncoder(fId.envAmp4, 4),
    modTimeEncoder(fId.envAmp1Time, 1, fId.Duration),
    modTimeEncoder(fId.envAmp2Time, 2, fId.Duration),
    modTimeEncoder(fId.envAmp3Time, 3, fId.Duration),
    modTimeEncoder(fId.envAmp4Time, 4, fId.Duration),
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
