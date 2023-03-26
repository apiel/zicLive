import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { graphRect } from '../graphRect';
import { drawEnvelope } from '../../draw/drawEnvelope';

const fId = SynthDualOsc.FloatId;

const encoders: Encoders = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

export const synthEnv = {
    header: () => {
        const patch = getPatch(currentPatchId);
        const envMs = patch.floats[fId.envAttack] + patch.floats[fId.envDecay] + patch.floats[fId.envRelease];
        const env = (envMs / 4) * 5;
        drawEnvelope(
            graphRect,
            env
                ? [
                      [0, 0],
                      [1, patch.floats[fId.envAttack] / env],
                      [patch.floats[fId.envSustain], (patch.floats[fId.envAttack] + patch.floats[fId.envDecay]) / env],
                      [patch.floats[fId.envSustain], 1.0 - patch.floats[fId.envRelease] / env],
                      [0.0, 1.0],
                  ]
                : [
                      [0, 0],
                      [0.0, 1.0],
                  ],
        );

        drawText('Envelope', { x: 350, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
