"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incSelectedSequenceId = exports.setSelectedSequenceId = exports.getSelectedSequence = exports.getSelectedSequenceId = exports.newSequence = exports.saveSequences = exports.saveSequence = exports.loadSequences = exports.loadSequence = exports.initPattern = exports.toggleSequence = exports.playSequence = exports.cleanActiveStep = exports.getSequencesForPatchId = exports.getPlayingSequencesForPatch = exports.getPlayingSequence = exports.getSequence = exports.sequences = exports.StepCondition = exports.STEP_CONDITIONS = exports.playing = void 0;
const promises_1 = require("fs/promises");
const zic_node_1 = require("zic_node");
const config_1 = require("./config");
const patch_1 = require("./patch");
const util_1 = require("./util");
// FIXME
exports.playing = [4, 7, 8, 10];
exports.STEP_CONDITIONS = [
    '---',
    'Pair',
    '4th',
    '6th',
    '8th',
    'Impair',
    '1%',
    '2%',
    '5%',
    '10%',
    '20%',
    '30%',
    '40%',
    '50%',
    '60%',
    '70%',
    '80%',
    '90%',
    '95%',
];
var StepCondition;
(function (StepCondition) {
    StepCondition[StepCondition["All"] = 0] = "All";
    StepCondition[StepCondition["Pair"] = 1] = "Pair";
    StepCondition[StepCondition["Fourth"] = 2] = "Fourth";
    StepCondition[StepCondition["Sixth"] = 3] = "Sixth";
    StepCondition[StepCondition["Eighth"] = 4] = "Eighth";
    StepCondition[StepCondition["Impair"] = 5] = "Impair";
    StepCondition[StepCondition["OnePercent"] = 6] = "OnePercent";
    StepCondition[StepCondition["TwoPercent"] = 7] = "TwoPercent";
    StepCondition[StepCondition["FivePercent"] = 8] = "FivePercent";
    StepCondition[StepCondition["TenPercent"] = 9] = "TenPercent";
    StepCondition[StepCondition["TwentyPercent"] = 10] = "TwentyPercent";
    StepCondition[StepCondition["ThirtyPercent"] = 11] = "ThirtyPercent";
    StepCondition[StepCondition["FortyPercent"] = 12] = "FortyPercent";
    StepCondition[StepCondition["FiftyPercent"] = 13] = "FiftyPercent";
    StepCondition[StepCondition["SixtyPercent"] = 14] = "SixtyPercent";
    StepCondition[StepCondition["SeventyPercent"] = 15] = "SeventyPercent";
    StepCondition[StepCondition["EightyPercent"] = 16] = "EightyPercent";
    StepCondition[StepCondition["NinetyPercent"] = 17] = "NinetyPercent";
    StepCondition[StepCondition["NinetyFivePercent"] = 18] = "NinetyFivePercent";
})(StepCondition = exports.StepCondition || (exports.StepCondition = {}));
// FIXME should this be an object instead of an array?
// or should id be the index?
exports.sequences = [];
function getSequence(id) {
    return exports.sequences[id];
}
exports.getSequence = getSequence;
function getPlayingSequence(trackId) {
    return exports.sequences.find((s) => s.playing && s.trackId === trackId);
}
exports.getPlayingSequence = getPlayingSequence;
function getPlayingSequencesForPatch(patchId) {
    return getSequencesForPatchId(patchId).filter((s) => s.playing);
}
exports.getPlayingSequencesForPatch = getPlayingSequencesForPatch;
function getSequencesForPatchId(patchId) {
    return exports.sequences.filter((s) => s.steps.flat().find((step) => step?.patchId === patchId));
}
exports.getSequencesForPatchId = getSequencesForPatchId;
function cleanActiveStep(trackId) {
    const seqs = exports.sequences.filter((s) => s.trackId === trackId && s.activeStep !== undefined);
    for (const seq of seqs) {
        seq.activeStep = undefined;
    }
}
exports.cleanActiveStep = cleanActiveStep;
// function getPatchesInSequence(sequence: Sequence) {
//     return [...new Set(sequence.steps.flat().map((step) => step?.patchId))].filter(
//         (patchId) => patchId !== undefined,
//     ) as number[];
// }
function playSequence(sequence, playing = true, next) {
    if (sequence.trackId !== undefined) {
        if (playing) {
            const playingSeq = getPlayingSequence(sequence.trackId);
            if (playingSeq) {
                playingSeq.playing = false;
            }
        }
        sequence.playing = playing;
        (0, zic_node_1.setSequencerState)(sequence.trackId, sequence.id, playing, {
            next,
            detune: sequence.detune,
            dataId: sequence.id,
        });
    }
}
exports.playSequence = playSequence;
function toggleSequence(sequence) {
    playSequence(sequence, !sequence.playing, true);
}
exports.toggleSequence = toggleSequence;
function getFilepath(id) {
    const idStr = id.toString().padStart(3, '0');
    return `${config_1.config.path.sequences}/${idStr}.json`;
}
// FIXME should we instead load sequence in memory
function initPattern({ id, stepCount, steps }) {
    (0, zic_node_1.setPatternLength)(id, stepCount);
    for (let stepIndex = 0; stepIndex < zic_node_1.MAX_STEPS_IN_PATTERN; stepIndex++) {
        for (let voice = 0; voice < zic_node_1.MAX_VOICES_IN_PATTERN; voice++) {
            const step = steps[stepIndex]?.[voice];
            if (step) {
                (0, zic_node_1.setPatternStep)(id, stepIndex, step.note, step.velocity, step.tie, step.patchId, voice);
            }
            else {
                (0, zic_node_1.cleanPatternStep)(id, stepIndex, voice);
            }
        }
    }
}
exports.initPattern = initPattern;
async function loadSequence(id) {
    if (await (0, util_1.fileExist)(getFilepath(id))) {
        const content = await (0, promises_1.readFile)(getFilepath(id), 'utf8');
        const sequence = JSON.parse(content.toString());
        // Fill missing step to pattern
        sequence.steps = [
            ...sequence.steps,
            ...Array.from({ length: zic_node_1.MAX_STEPS_IN_PATTERN - sequence.steps.length }, () => []),
        ];
        initPattern(sequence);
        if (sequence.playing) {
            playSequence(sequence);
        }
        exports.sequences[sequence.id] = sequence;
    }
    else {
        const sequence = {
            id,
            trackId: undefined,
            playing: false,
            detune: 0,
            repeat: 0,
            stepCount: 16,
            steps: Array.from({ length: zic_node_1.MAX_STEPS_IN_PATTERN }, () => []),
        };
        initPattern(sequence);
        exports.sequences[sequence.id] = sequence;
    }
}
exports.loadSequence = loadSequence;
async function loadSequences() {
    try {
        exports.sequences = [];
        for (let id = 0; id < zic_node_1.PATTERN_COUNT; id++) {
            await loadSequence(id);
        }
    }
    catch (error) {
        console.error(`Error while loading sequences`, error);
    }
}
exports.loadSequences = loadSequences;
function saveSequence(sequence) {
    return (0, promises_1.writeFile)(getFilepath(sequence.id), JSON.stringify(sequence));
}
exports.saveSequence = saveSequence;
async function saveSequences() {
    try {
        for (let id = 0; id < zic_node_1.PATTERN_COUNT; id++) {
            await saveSequence(exports.sequences[id]);
        }
    }
    catch (error) {
        console.error(`Error while saving sequences`, error);
    }
}
exports.saveSequences = saveSequences;
function newSequence() {
    const sequence = {
        id: exports.sequences.length,
        trackId: 0,
        playing: false,
        detune: 0,
        repeat: 0,
        nextSequenceId: undefined,
        patchId: 0,
        stepCount: 16,
        steps: Array.from({ length: zic_node_1.MAX_STEPS_IN_PATTERN }, () => []),
    };
    exports.sequences.push(sequence);
    setSelectedSequenceId(sequence.id);
}
exports.newSequence = newSequence;
let selectedSequenceId = 0;
function getSelectedSequenceId() {
    return selectedSequenceId;
}
exports.getSelectedSequenceId = getSelectedSequenceId;
function getSelectedSequence() {
    return exports.sequences[selectedSequenceId];
}
exports.getSelectedSequence = getSelectedSequence;
function setSelectedSequenceId(id) {
    selectedSequenceId = id % exports.sequences.length;
    const patchId = exports.sequences[selectedSequenceId].steps.flat().find((step) => step)?.patchId;
    if (patchId !== undefined) {
        (0, patch_1.setCurrentPatchId)(patchId);
    }
}
exports.setSelectedSequenceId = setSelectedSequenceId;
function incSelectedSequenceId(direction) {
    if (direction > 0 && selectedSequenceId < exports.sequences.length - 1) {
        setSelectedSequenceId(selectedSequenceId + 1);
    }
    else if (direction < 0 && selectedSequenceId > 0) {
        setSelectedSequenceId(selectedSequenceId - 1);
    }
}
exports.incSelectedSequenceId = incSelectedSequenceId;
