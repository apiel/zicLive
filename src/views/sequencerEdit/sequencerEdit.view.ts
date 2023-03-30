import { sendMidiMessage } from 'zic_node';
import { renderMessage } from '../../draw/drawMessage';
import { encodersHandler, encodersView } from '../../layout/encoders.layout';
import { cleanPadMatrix, MidiMsg, midiOutController, MIDI_TYPE, shiftPressed } from '../../midi';
import { akaiApcKey25 } from '../../midi/akaiApcKey25';
import { sequenceEditHeader } from '../../nodes/sequenceEditHeader.node';
import { sequenceMenuHandler, sequencerMenu } from './sequencerEdit.menu';
import { getSelectedSequence, initPattern } from '../../sequence';
import { getTrackStyle } from '../../track';
import { RenderOptions, viewPadPressed } from '../../view';
import { pageMidiHandler } from '../controller/pageController';
import { bankController, sequencerController, sequenceSelectMidiHandler } from '../controller/sequencerController';
import { changePage, currentStep, setCurrentStep } from './changePage';
import { mainEncoders } from './encoders/mainEncoder';
import { patternEncoders } from './encoders/patternEncoders';
import { initNote } from './initNote';

// TODO for note encoder, debounce only rendering but not change...

function patternController() {
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

export async function sequencerEditView({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        if (viewPadPressed) {
            sequencerController();
            bankController();
        } else {
            patternController();
        }
    }

    if (currentStep === -1) {
        encodersView(mainEncoders);
        sequenceEditHeader();
    } else {
        encodersView(patternEncoders);
        sequenceEditHeader(currentStep);
    }
    sequencerMenu();

    renderMessage();
}

export async function sequencerEditMidiHandler(midiMsg: MidiMsg) {
    const menuStatus = await sequenceMenuHandler(midiMsg);
    if (menuStatus !== false) {
        return menuStatus !== undefined;
    }

    if (pageMidiHandler(midiMsg, changePage)) {
        return true;
    }

    if (viewPadPressed && sequenceSelectMidiHandler(midiMsg)) {
        return true;
    }
    const result = patternMidiHandler(midiMsg);

    if (result) {
        const sequence = getSelectedSequence();
        if (sequence.trackId !== undefined) {
            initPattern(sequence);
        }
        return true;
    }

    return encodersHandler(currentStep === -1 ? mainEncoders : patternEncoders, midiMsg);
}

function patternMidiHandler(midiMsg: MidiMsg) {
    const [type, key, value] = midiMsg.message;
    if (midiMsg.isController) {
        if (type === MIDI_TYPE.KEY_RELEASED) {
            const stepIndex = akaiApcKey25.padMatrixFlat.indexOf(key);
            if (stepIndex !== -1 && stepIndex < getSelectedSequence().stepCount) {
                setCurrentStep(stepIndex);
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

    return false;
}
