import { Midi } from 'tonal';
import { RenderOptions, viewPadPressed } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import { sequencerController, sequenceSelectMidiHandler } from './controller/sequencerController';
import { getSelectedSequence } from '../sequence';
import { minmax } from '../util';
import { Encoders, encodersHandler, encodersView } from './layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';
import { sequenceEncoder } from './sequencerEdit.view';
import { NOTE_END, NOTE_START } from 'zic_node';
import { getTrack } from '../track';
import { config } from '../config';

let currentStep = 0;

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
            const { steps } = getSelectedSequence();
            const step = steps[currentStep][0];
            return step ? Midi.midiToNoteName(step.note, { sharps: true }) : `---`;
        },
        handler: async (direction) => {
            // TODO using shift could switch per octave
            // TODO need a quick way to set a note to null
            const { steps, trackId } = getSelectedSequence();
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
                        (trackId !== undefined ? config.engines[getTrack(trackId).engine].idStart : 0),
                };
            }
            return false;
        },
    },
    {
        title: 'Tie',
        getValue: () => `---`,
        handler: async (direction) => {
            return false;
        },
    },
    undefined,
    {
        title: 'Step',
        getValue: () => `${currentStep + 1}`,
        handler: async (direction) => {
            const { stepCount } = getSelectedSequence();
            currentStep = minmax(currentStep + direction, 0, stepCount - 1);
            return true;
        },
        unit: () => {
            const { stepCount } = getSelectedSequence();
            return `/ ${stepCount}`;
        },
    },
    {
        title: 'Condition',
        getValue: () => `---`,
        handler: async (direction) => {
            return false;
        },
    },
    {
        title: 'Patch',
        getValue: () => `---`,
        handler: async (direction) => {
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
