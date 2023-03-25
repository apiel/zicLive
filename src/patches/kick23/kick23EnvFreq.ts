import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { Kick23 } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { graphRect } from '../graphRect';
import { drawEnvelope } from '../../draw/drawEnvelope';
import { modLevelEncoder, modTimeEncoder } from '../encoders';

const fId = Kick23.FloatId;

const encoders: Encoders = [
    modLevelEncoder(fId.envFreq1, 1),
    modLevelEncoder(fId.envFreq2, 2),
    modLevelEncoder(fId.envFreq3, 3),
    modLevelEncoder(fId.envFreq4, 4),
    modTimeEncoder(fId.envFreq1Time, 1, fId.Duration),
    modTimeEncoder(fId.envFreq2Time, 2, fId.Duration),
    modTimeEncoder(fId.envFreq3Time, 3, fId.Duration),
    modTimeEncoder(fId.envFreq4Time, 4, fId.Duration),
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
