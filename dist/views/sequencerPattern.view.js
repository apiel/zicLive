"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencerPatternMidiHandler = exports.sequencerPatternView = void 0;
const tonal_1 = require("tonal");
const view_1 = require("../view");
const drawMessage_1 = require("../draw/drawMessage");
const midi_1 = require("../midi");
const sequencerController_1 = require("./controller/sequencerController");
const sequence_1 = require("../sequence");
const util_1 = require("../util");
const encoders_layout_1 = require("./layout/encoders.layout");
const sequenceEditHeader_node_1 = require("../nodes/sequenceEditHeader.node");
const sequencerEdit_view_1 = require("./sequencerEdit.view");
const zic_node_1 = require("zic_node");
const track_1 = require("../track");
const config_1 = require("../config");
const patch_1 = require("../patch");
const akaiApcKey25_1 = require("../midi/akaiApcKey25");
const sequenceMenu_node_1 = require("../nodes/sequenceMenu.node");
let currentStep = 0;
// TODO for note encoder, debounce only rendering but not change...
function initNote(steps, trackId) {
    const previousStep = steps
        .slice(0, currentStep)
        .reverse()
        .find((step) => step[0]?.note)?.[0];
    steps[currentStep][0] = {
        note: previousStep?.note ?? 60,
        velocity: 100,
        tie: false,
        patchId: previousStep?.patchId ??
            steps.flat().find((s) => s)?.patchId ??
            config_1.config.engines[(0, track_1.getTrack)(trackId).engine].idStart,
    };
}
const encoders = [
    {
        ...sequencerEdit_view_1.sequenceEncoder,
        handler: (direction) => {
            currentStep = 0;
            return sequencerEdit_view_1.sequenceEncoder.handler(direction);
        },
    },
    {
        title: 'Note',
        getValue: () => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step ? tonal_1.Midi.midiToNoteName(step.note, { sharps: true }) : `---`;
        },
        handler: async (direction) => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    if (direction < 0 && step.note <= zic_node_1.NOTE_START) {
                        steps[currentStep][0] = null;
                    }
                    else {
                        step.note = (0, util_1.minmax)(step.note + (midi_1.shiftPressed ? direction * 12 : direction), zic_node_1.NOTE_START, zic_node_1.NOTE_END);
                    }
                }
                else if (direction === 1) {
                    // If no already existing step, create one if direction is positive
                    initNote(steps, trackId);
                }
            }
            return false;
        },
    },
    {
        title: 'Velocity',
        getValue: () => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step ? `${step.velocity.toString().padStart(3, ' ')}` : `---`;
        },
        handler: async (direction) => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    step.velocity = (0, util_1.minmax)(step.velocity + direction, 1, 100);
                    return true;
                }
            }
            return false;
        },
        unit: () => ((0, sequence_1.getSelectedSequence)().steps[currentStep][0] ? `%` : ``),
    },
    {
        title: 'Tie',
        getValue: () => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step?.tie ? `Tie` : `---`;
        },
        handler: async () => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
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
            const { trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId === undefined) {
                return '';
            }
            return `${currentStep + 1}`;
        },
        handler: async (direction) => {
            const { trackId, stepCount } = (0, sequence_1.getSelectedSequence)();
            if (trackId !== undefined) {
                currentStep = (0, util_1.minmax)(currentStep + direction, 0, stepCount - 1);
            }
            return true;
        },
        unit: () => {
            const { stepCount } = (0, sequence_1.getSelectedSequence)();
            return `/ ${stepCount}`;
        },
    },
    {
        title: 'Patch',
        getValue: () => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step?.patchId ? '#' + step.patchId.toString().padStart(3, '0') : '---';
        },
        handler: async (direction) => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    const engine = config_1.config.engines[(0, track_1.getTrack)(trackId).engine];
                    step.patchId = (0, util_1.minmax)(step.patchId + direction, engine.idStart, engine.idEnd);
                    return true;
                }
            }
            return false;
        },
        unit: () => {
            const { steps } = (0, sequence_1.getSelectedSequence)();
            const step = steps[currentStep][0];
            if (step?.patchId) {
                return (0, patch_1.getPatch)(step.patchId).name;
            }
            return '';
        },
    },
    {
        title: 'Condition',
        getValue: () => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId === undefined) {
                return '';
            }
            const step = steps[currentStep][0];
            return step?.condition ? sequence_1.STEP_CONDITIONS[step.condition] : '---';
        },
        handler: async (direction) => {
            const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
            if (trackId !== undefined) {
                const step = steps[currentStep][0];
                if (step) {
                    step.condition = (0, util_1.minmax)((step?.condition || 0) + direction, 0, sequence_1.STEP_CONDITIONS.length - 1);
                    return true;
                }
            }
            return false;
        },
    },
    undefined,
];
function patternController() {
    if (midi_1.midiOutController !== undefined) {
        const { steps, trackId, stepCount } = (0, sequence_1.getSelectedSequence)();
        (0, midi_1.cleanPadMatrix)();
        if (trackId !== undefined) {
            const { padColor } = (0, track_1.getTrackStyle)(trackId);
            for (let i = 0; i < stepCount; i++) {
                const step = steps[i][0];
                const pad = akaiApcKey25_1.akaiApcKey25.padMatrixFlat[i];
                (0, zic_node_1.sendMidiMessage)(midi_1.midiOutController.port, [
                    step ? akaiApcKey25_1.akaiApcKey25.padMode.on100pct : akaiApcKey25_1.akaiApcKey25.padMode.on10pct,
                    pad,
                    padColor,
                ]);
            }
        }
    }
}
async function sequencerPatternView({ controllerRendering } = {}) {
    // TODO implement init option to reset currentStep
    if (controllerRendering) {
        if (view_1.viewPadPressed) {
            (0, sequencerController_1.sequencerController)();
        }
        else {
            patternController();
        }
    }
    (0, encoders_layout_1.encodersView)(encoders);
    (0, sequenceEditHeader_node_1.sequenceEditHeader)(currentStep);
    (0, sequenceMenu_node_1.sequencerMenuNode)();
    (0, drawMessage_1.renderMessage)();
}
exports.sequencerPatternView = sequencerPatternView;
function midiHandler(midiMsg, _viewPadPressed) {
    const [type, key, value] = midiMsg.message;
    if (midiMsg.isController) {
        if (type === midi_1.MIDI_TYPE.KEY_RELEASED) {
            const stepIndex = akaiApcKey25_1.akaiApcKey25.padMatrixFlat.indexOf(key);
            if (stepIndex !== -1 && stepIndex < (0, sequence_1.getSelectedSequence)().stepCount) {
                currentStep = stepIndex;
                if (!midi_1.shiftPressed) {
                    const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
                    if (trackId !== undefined) {
                        const step = steps[currentStep][0];
                        if (step) {
                            steps[currentStep][0] = null;
                        }
                        else {
                            initNote(steps, trackId);
                        }
                    }
                }
                return true;
            }
        }
    }
    else if (midiMsg.isKeyboard) {
        const { steps, trackId } = (0, sequence_1.getSelectedSequence)();
        const step = steps[currentStep][0];
        if (trackId !== undefined && step) {
            if (type === midi_1.MIDI_TYPE.KEY_RELEASED) {
                step.note = key;
                return true;
            }
            else if (type === midi_1.MIDI_TYPE.CC && key === akaiApcKey25_1.akaiApcKey25.keyboardCC.sustain && value === 127) {
                step.tie = !step.tie;
                return true;
            }
        }
    }
    return (0, encoders_layout_1.encodersHandler)(encoders, midiMsg);
}
async function sequencerPatternMidiHandler(midiMsg, _viewPadPressed) {
    const menuStatus = await (0, sequenceMenu_node_1.sequenceMenuHandler)(midiMsg);
    if (menuStatus !== false) {
        return menuStatus !== undefined;
    }
    if ((0, sequencerController_1.sequenceSelectMidiHandler)(midiMsg, _viewPadPressed)) {
        return true;
    }
    const result = midiHandler(midiMsg, _viewPadPressed);
    if (result) {
        const sequence = (0, sequence_1.getSelectedSequence)();
        if (sequence.trackId !== undefined) {
            (0, sequence_1.initPattern)(sequence);
        }
    }
    return result;
}
exports.sequencerPatternMidiHandler = sequencerPatternMidiHandler;
