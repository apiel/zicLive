import { config } from '../../config';
import { Steps } from '../../sequence';
import { getTrack } from '../../track';
import { currentStep } from './changePage';

export function initNote(steps: Steps, trackId: number) {
    const previousStep = steps
        .slice(0, currentStep)
        .reverse()
        .find((step) => step[0]?.note)?.[0];
    steps[currentStep][0] = {
        note: previousStep?.note ?? 60,
        velocity: 100,
        tie: false,
        patchId:
            previousStep?.patchId ??
            steps.flat().find((s) => s)?.patchId ??
            config.engines[getTrack(trackId).engine].idStart,
    };
}
