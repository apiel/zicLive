import { Midi } from 'tonal';
import { NOTE_END, NOTE_START } from 'zic_node';
import { config } from '../../../config';
import { Encoders } from '../../../layout/encoders.layout';
import { shiftPressed } from '../../../midi';
import { getPatch } from '../../../patch';
import {
    getSelectedSequence, STEP_CONDITIONS
} from '../../../sequence';
import { getTrack } from '../../../track';
import { minmax } from '../../../util';
import { currentStep, setCurrentStep } from '../changePage';
import { initNote } from '../initNote';
import { sequenceEncoder } from './sequenceEncoder';
import { isDisabled } from './mainEncoder';

// TODO for note encoder, debounce only rendering but not change...

export const patternEncoders: Encoders = [
    {
        ...sequenceEncoder,
        handler: (direction) => {
            setCurrentStep(0);
            return sequenceEncoder.handler(direction);
        },
    },
    {
        node: {
            title: 'Note',
            getValue: () => {
                const { steps } = getSelectedSequence();
                const step = steps[currentStep][0];
                return step ? Midi.midiToNoteName(step.note, { sharps: true }) : `---`;
            },
            isDisabled,
        },
        handler: async (direction) => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    if (direction < 0 && step.note <= NOTE_START) {
                        steps[currentStep][0] = null;
                    } else {
                        step.note = minmax(
                            step.note + (shiftPressed ? direction * 12 : direction),
                            NOTE_START,
                            NOTE_END,
                        );
                    }
                } else if (direction === 1) {
                    // If no already existing step, create one if direction is positive
                    initNote(steps, trackId);
                }
            }
            return false;
        },
    },
    {
        node: {
            title: 'Velocity',
            getValue: () => {
                const { steps } = getSelectedSequence();
                const step = steps[currentStep][0];
                return step ? `${step.velocity.toString().padStart(3, ' ')}` : `---`;
            },
            unit: () => (getSelectedSequence().steps[currentStep][0] ? `%` : ``),
            isDisabled,
        },
        handler: async (direction) => {
            const { steps } = getSelectedSequence();
            const step = steps[currentStep][0];
            if (step) {
                step.velocity = minmax(step.velocity + direction, 1, 100);
                return true;
            }
            return false;
        },
    },
    {
        node: {
            title: 'Tie',
            getValue: () => {
                const { steps } = getSelectedSequence();
                const step = steps[currentStep][0];
                return step?.tie ? `Tie` : `---`;
            },
            isDisabled,
        },
        handler: async () => {
            const { steps } = getSelectedSequence();
            const step = steps[currentStep][0];
            if (step) {
                step.tie = !step.tie;
                return true;
            }
            return false;
        },
        debounce: 1000,
    },
    {
        node: {
            title: 'Step',
            getValue: () => `${currentStep + 1}`,
            unit: () => {
                const { stepCount } = getSelectedSequence();
                return `/ ${stepCount}`;
            },
            isDisabled,
        },
        handler: async (direction) => {
            const { stepCount } = getSelectedSequence();
            setCurrentStep(minmax(currentStep + direction, 0, stepCount - 1));
            return true;
        },
    },
    {
        node: {
            title: 'Patch',
            getValue: () => {
                const { steps } = getSelectedSequence();
                const step = steps[currentStep][0];
                return step?.patchId ? '#' + step.patchId.toString().padStart(3, '0') : '---';
            },
            unit: () => {
                const { steps } = getSelectedSequence();
                const step = steps[currentStep][0];
                if (step?.patchId) {
                    return getPatch(step.patchId).name;
                }
                return '';
            },
            isDisabled,
        },
        handler: async (direction) => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    const engine = config.engines[getTrack(trackId).engine];
                    step.patchId = minmax(step.patchId + direction, engine.idStart, engine.idEnd);
                    return true;
                }
            }
            return false;
        },
    },
    {
        node: {
            title: 'Condition',
            getValue: () => {
                const { steps } = getSelectedSequence();
                const step = steps[currentStep][0];
                return step?.condition ? STEP_CONDITIONS[step.condition] : '---';
            },
            isDisabled,
        },
        handler: async (direction) => {
            const { steps } = getSelectedSequence();
            const step = steps[currentStep][0];
            if (step) {
                step.condition = minmax((step?.condition || 0) + direction, 0, STEP_CONDITIONS.length - 1);
                return true;
            }
            return false;
        },
    },
    undefined,
];
