import { readFile, writeFile } from 'fs/promises';
import { MAX_STEPS_IN_PATTERN, MAX_VOICES_IN_PATTERN, PATTERN_COUNT, setPatternLength, setPatternStep } from 'zic_node';
import { config } from './config';
import { minmax } from './util';
export const STEP_CONDITIONS = [
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
export var StepCondition;
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
})(StepCondition || (StepCondition = {}));
const defaultPattern = (id = 0) => ({
    id,
    stepCount: 16,
    steps: Array.from({ length: MAX_STEPS_IN_PATTERN }, () => []),
});
const patterns = [];
let patternId = 0;
export function getPattern(id = patternId) {
    if (patterns.length === 0) {
        throw new Error("Patterns haven't been initialized yet.");
    }
    return patterns[id];
}
export function setPatternId(id) {
    patternId = minmax(id, 0, PATTERN_COUNT - 1);
}
function getFilepath(id) {
    const idStr = id.toString().padStart(3, '0');
    return `${config.path.patterns}/${idStr}.json`;
}
function initPattern({ id, stepCount, steps }) {
    setPatternLength(id, stepCount);
    for (let stepIndex = 0; stepIndex < MAX_STEPS_IN_PATTERN; stepIndex++) {
        for (let voice = 0; voice < MAX_VOICES_IN_PATTERN; voice++) {
            const step = steps[stepIndex]?.[voice];
            if (step) {
                setPatternStep(id, stepIndex, step.note, step.velocity, step.tie, voice);
            }
        }
    }
}
export async function loadPattern(id) {
    try {
        const content = await readFile(getFilepath(id), 'utf8');
        const pattern = JSON.parse(content.toString());
        // Fill missing step to pattern
        pattern.steps = [
            ...pattern.steps,
            ...Array.from({ length: MAX_STEPS_IN_PATTERN - pattern.steps.length }, () => []),
        ];
        initPattern(pattern);
        return pattern;
    }
    catch (error) { }
    return defaultPattern(id);
}
export function savePattern(pattern) {
    return writeFile(getFilepath(pattern.id), JSON.stringify(pattern));
}
export async function reloadPattern(id) {
    patterns[id] = await loadPattern(id);
}
export async function loadPatterns() {
    for (let id = 0; id < PATTERN_COUNT; id++) {
        patterns.push(await loadPattern(id));
    }
}
