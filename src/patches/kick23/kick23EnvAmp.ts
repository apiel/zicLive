import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { color } from '../../style';
import { drawSubTitle, graphRect } from '../draw';
import { drawEnvelope } from '../../draw/drawEnvelope';
import { modLevelEncoder, modTimeEncoder } from '../encoders';

// TODO forbid to set time before the previous one

const fId = Kick23.FloatId;

const encoders: Encoders = [
    modLevelEncoder(fId.envAmp1, 1, color.graph[0]),
    modLevelEncoder(fId.envAmp2, 2, color.graph[1]),
    modLevelEncoder(fId.envAmp3, 3, color.graph[2]),
    modLevelEncoder(fId.envAmp4, 4, color.graph[3]),
    modTimeEncoder(fId.envAmp1Time, 1, fId.Duration, color.graph[0]),
    modTimeEncoder(fId.envAmp2Time, 2, fId.Duration, color.graph[1]),
    modTimeEncoder(fId.envAmp3Time, 3, fId.Duration, color.graph[2]),
    modTimeEncoder(fId.envAmp4Time, 4, fId.Duration, color.graph[3]),
];

export const kick23EnvAmp = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawEnvelope(graphRect, [
            [0, 0],
            [1, 0.01], // Force to have a very short ramp up to avoid clicks
            [patch.floats[fId.envAmp1], patch.floats[fId.envAmp1Time], color.graph[0]],
            [patch.floats[fId.envAmp2], patch.floats[fId.envAmp2Time], color.graph[1]],
            [patch.floats[fId.envAmp3], patch.floats[fId.envAmp3Time], color.graph[2]],
            [patch.floats[fId.envAmp4], patch.floats[fId.envAmp4Time], color.graph[3]],
            [0.0, 1.0],
        ]);
        drawSubTitle('Envelope Amplitude');
    },
    encoders,
};
