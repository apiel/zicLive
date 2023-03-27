import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { graphRect } from '../graphRect';
import { drawEnvelope } from '../../draw/drawEnvelope';
import { minmax } from '../../util';
import { shiftPressed } from '../../midi';
import { adsrEncoders } from '../encoders';

const fId = SynthDualOsc.FloatId;

const encoders: Encoders = [
    ...adsrEncoders(fId.envAttack, fId.envDecay, fId.envSustain, fId.envRelease),
    undefined,
    undefined,
    undefined,
    undefined,
];

export const synthEnv = {
    header: () => {
        const patch = getPatch(currentPatchId);
        const envMs = patch.floats[fId.envAttack] + patch.floats[fId.envDecay] + patch.floats[fId.envRelease];
        const env = (envMs / 4) * 5;
        drawEnvelope(
            graphRect,
            env
                ? [
                      [0, 0, undefined, color.graph[0]],
                      [1, patch.floats[fId.envAttack] / env, color.graph[0], color.graph[1]],
                      [
                          patch.floats[fId.envSustain],
                          (patch.floats[fId.envAttack] + patch.floats[fId.envDecay]) / env,
                          color.graph[1],
                          color.graph[2],
                      ],
                      [
                          patch.floats[fId.envSustain],
                          1.0 - patch.floats[fId.envRelease] / env,
                          color.graph[3],
                          color.graph[3],
                      ],
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
