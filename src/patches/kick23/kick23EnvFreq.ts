import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { color } from '../../style';
import { drawSubTitle, graphRect } from '../draw';
import { drawEnvelope } from '../../draw/drawEnvelope';
import { modLevelEncoder, modTimeEncoder } from '../encoders';

const fId = Kick23.FloatId;

const encoders: Encoders = [
    modLevelEncoder(fId.envFreq1, 1, color.graph[0]),
    modLevelEncoder(fId.envFreq2, 2, color.graph[1]),
    modLevelEncoder(fId.envFreq3, 3, color.graph[2]),
    modLevelEncoder(fId.envFreq4, 4, color.graph[3]),
    modTimeEncoder(fId.envFreq1Time, 1, fId.Duration, color.graph[0]),
    modTimeEncoder(fId.envFreq2Time, 2, fId.Duration, color.graph[1]),
    modTimeEncoder(fId.envFreq3Time, 3, fId.Duration, color.graph[2]),
    modTimeEncoder(fId.envFreq4Time, 4, fId.Duration, color.graph[3]),
];

export const kick23EnvFreq = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawEnvelope(graphRect, [
            [1.0, 0.0],
            [patch.floats[fId.envFreq1], patch.floats[fId.envFreq1Time], color.graph[0]],
            [patch.floats[fId.envFreq2], patch.floats[fId.envFreq2Time], color.graph[1]],
            [patch.floats[fId.envFreq3], patch.floats[fId.envFreq3Time], color.graph[2]],
            [patch.floats[fId.envFreq4], patch.floats[fId.envFreq4Time], color.graph[3]],
            [0.0, 1.0],
        ]);
        drawSubTitle('Envelope Frequency');
    },
    encoders,
};
