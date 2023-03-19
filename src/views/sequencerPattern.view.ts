import { Midi } from 'tonal';
import { RenderOptions, viewPadPressed } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import { sequencerController, sequenceSelectMidiHandler } from './controller/sequencerController';
import { getSelectedSequence, STEP_CONDITIONS } from '../sequence';
import { minmax } from '../util';
import { Encoders, encodersHandler, encodersView } from './layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';
import { sequenceEncoder } from './sequencerEdit.view';
import { NOTE_END, NOTE_START } from 'zic_node';
import { getTrack } from '../track';
import { config } from '../config';
import { getPatch } from '../patch';

let currentStep = 0;

// TODO use keyboard to set note

// TODO save/reload sequence
// withInfo('Sequence loaded', () => loadSequence(selectedId)),
// withSuccess('Sequences saved', () => saveSequence(sequences[selectedId])),

const encoders: Encoders = [
    {
        ...sequenceEncoder,
        handler: (direction) => {
            currentStep = 0;
            return sequenceEncoder.handler(direction);
        },
    },
    {
        title: 'Note',
        getValue: () => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step ? Midi.midiToNoteName(step.note, { sharps: true }) : `---`;
        },
        handler: async (direction) => {
            // TODO using shift could switch per octave
            // TODO need a quick way to set a note to null
            const { steps, trackId } = getSelectedSequence();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    if (direction < 0 && step.note <= NOTE_START) {
                        steps[currentStep][0] = null;
                    } else {
                        step.note = minmax(step.note + direction, NOTE_START, NOTE_END);
                    }
                } else if (direction === 1) {
                    // If no already existing step, create one if direction is positive
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
            }
            return false;
        },
    },
    {
        title: 'Velocity',
        getValue: () => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step ? `${step.velocity.toString().padStart(3, ' ')}` : `---`;
        },
        handler: async (direction) => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    step.velocity = minmax(step.velocity + direction, 1, 100);
                    return true;
                }
            }
            return false;
        },
        unit: () => (getSelectedSequence().steps[currentStep][0] ? `%` : ``),
    },
    {
        title: 'Tie',
        getValue: () => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step?.tie ? `Tie` : `---`;
        },
        handler: async () => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    step.tie = !step.tie;
                    return true;
                }
            }
            return false;
        },
        debounce: 1000,
    },
    {
        title: 'Step',
        getValue: () => {
            const { trackId } = getSelectedSequence();
            if (trackId === undefined) {
                return '';
            }
            return `${currentStep + 1}`;
        },
        handler: async (direction) => {
            const { trackId, stepCount } = getSelectedSequence();
            if (trackId !== undefined) {
                currentStep = minmax(currentStep + direction, 0, stepCount - 1);
            }
            return true;
        },
        unit: () => {
            const { stepCount } = getSelectedSequence();
            return `/ ${stepCount}`;
        },
    },
    {
        title: 'Patch',
        getValue: () => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step?.patchId ? '#' + step.patchId.toString().padStart(3, '0') : '---';
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
        unit: () => {
            const { steps } = getSelectedSequence();
            const step = steps[currentStep][0];
            if (step?.patchId) {
                return getPatch(step.patchId).name;
            }
            return '';
        },
    },
    {
        title: 'Condition',
        getValue: () => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step?.condition ? STEP_CONDITIONS[step.condition] : '---';
        },
        handler: async (direction) => {
            const { steps, trackId } = getSelectedSequence();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    step.condition = minmax((step?.condition || 0) + direction, 0, STEP_CONDITIONS.length - 1);
                    return true;
                }
            }
            return false;
        },
    },
    undefined,
];

export async function sequencerPatternView({ controllerRendering }: RenderOptions = {}) {
    // TODO implement init option to reset currentStep

    if (controllerRendering) {
        if (viewPadPressed) {
            sequencerController();
        } else {
            // pattern...
        }
    }

    encodersView(encoders);
    sequenceEditHeader(currentStep);

    renderMessage();
}

export async function sequencerPatternMidiHandler(midiMsg: MidiMsg, _viewPadPressed: boolean) {
    if (sequenceSelectMidiHandler(midiMsg, _viewPadPressed)) {
        return true;
    }
    return encodersHandler(encoders, midiMsg);
}
