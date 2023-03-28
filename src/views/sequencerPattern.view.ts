import { Midi } from 'tonal';
import { RenderOptions, viewPadPressed } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { cleanPadMatrix, MidiMsg, midiOutController, MIDI_TYPE, shiftPressed } from '../midi';
import { bankController, sequencerController, sequenceSelectMidiHandler } from './controller/sequencerController';
import { getSelectedSequence, getSelectedSequenceId, initPattern, sequences, setSelectedSequenceId, Steps, STEP_CONDITIONS } from '../sequence';
import { minmax } from '../util';
import { EncoderData, Encoders, encodersHandler, encodersView } from '../layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';
import { isDisabled } from './sequencerEdit.view';
import { NOTE_END, NOTE_START, sendMidiMessage } from 'zic_node';
import { getTrack, getTrackStyle } from '../track';
import { config } from '../config';
import { getPatch } from '../patch';
import { akaiApcKey25 } from '../midi/akaiApcKey25';
import { sequenceMenuHandler, sequencerMenuNode } from '../nodes/sequenceMenu.node';
import { forceSelectedItem } from '../selector';
import { View } from '../def';

// TODO for note encoder, debounce only rendering but not change...

export let currentStep = -1;
export function changePage(direction: number) {
    const { stepCount } = getSelectedSequence();
    currentStep = minmax(currentStep + direction, -1, stepCount - 1); // - 1 is the main page
}

export const sequenceEncoder: EncoderData = {
    node: {
        title: 'Sequence',
        getValue: () => {
            const { id, trackId } = getSelectedSequence();
            return {
                value: `#${`${id + 1}`.padStart(3, '0')}`,
                valueColor: trackId === undefined ? undefined : getTrackStyle(trackId).color,
            };
        },
    },
    handler: async (direction) => {
        const id = minmax(getSelectedSequenceId() + direction, 0, sequences.length - 1);
        setSelectedSequenceId(id);
        forceSelectedItem(View.Sequencer, id);
        return true;
    },
};

function initNote(steps: Steps, trackId: number) {
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

export const patternEncoders: Encoders = [
    {
        ...sequenceEncoder,
        handler: (direction) => {
            currentStep = 0;
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
            currentStep = minmax(currentStep + direction, 0, stepCount - 1);
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

export function patternController() {
    if (midiOutController !== undefined) {
        const { steps, trackId, stepCount } = getSelectedSequence();
        cleanPadMatrix();
        if (trackId !== undefined) {
            const { padColor } = getTrackStyle(trackId);
            for (let i = 0; i < stepCount; i++) {
                const step = steps[i][0];
                const pad = akaiApcKey25.padMatrixFlat[i];
                sendMidiMessage(midiOutController.port, [
                    step ? akaiApcKey25.padMode.on100pct : akaiApcKey25.padMode.on10pct,
                    pad,
                    padColor,
                ]);
            }
        }
    }
}

export function patternMidiHandler(midiMsg: MidiMsg) {
    const [type, key, value] = midiMsg.message;
    if (midiMsg.isController) {
        if (type === MIDI_TYPE.KEY_RELEASED) {
            const stepIndex = akaiApcKey25.padMatrixFlat.indexOf(key);
            if (stepIndex !== -1 && stepIndex < getSelectedSequence().stepCount) {
                currentStep = stepIndex;
                if (!shiftPressed) {
                    const { steps, trackId } = getSelectedSequence();
                    if (trackId !== undefined) {
                        const step = steps[currentStep][0];
                        if (step) {
                            steps[currentStep][0] = null;
                        } else {
                            initNote(steps, trackId);
                        }
                    }
                }
                return true;
            }
        }
    } else if (midiMsg.isKeyboard) {
        const { steps, trackId } = getSelectedSequence();
        const step = steps[currentStep][0];
        if (trackId !== undefined && step) {
            if (type === MIDI_TYPE.KEY_RELEASED) {
                step.note = key;
                return true;
            } else if (type === MIDI_TYPE.CC && key === akaiApcKey25.keyboardCC.sustain && value === 127) {
                step.tie = !step.tie;
                return true;
            }
        }
    }

    return encodersHandler(patternEncoders, midiMsg);
}
