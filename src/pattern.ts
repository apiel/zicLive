import { readFile, writeFile } from 'fs/promises';
import { MAX_STEPS_IN_PATTERN, PATTERN_COUNT } from 'zic_node';
import { config } from './config';
import { minmax } from './util';

export interface Step {
    note: number;
    velocity: number;
    tie: boolean;
    condition?: number;
}

export interface Pattern {
    id: number;
    stepCount: number;
    steps: (Step | null)[][];
}

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

export enum StepCondition {
    All,
    Pair,
    Fourth,
    Sixth,
    Eighth,
    Impair,
    OnePercent,
    TwoPercent,
    FivePercent,
    TenPercent,
    TwentyPercent,
    ThirtyPercent,
    FortyPercent,
    FiftyPercent,
    SixtyPercent,
    SeventyPercent,
    EightyPercent,
    NinetyPercent,
    NinetyFivePercent,
}

const defaultPattern = (id = 0): Pattern => ({
    id,
    stepCount: 16,
    steps: Array.from({ length: MAX_STEPS_IN_PATTERN }, () => []),
});

const patterns: Pattern[] = [];
let patternId: number = 0;

export function getPattern(id = patternId) {
    if (patterns.length === 0) {
        throw new Error("Patterns haven't been initialized yet.");
    }
    return patterns[id];
}

export function setPatternId(id: number) {
    patternId = minmax(id, 0, PATTERN_COUNT - 1);
}

function getFilepath(id: number) {
    const idStr = id.toString().padStart(3, '0');
    return `${config.path.patterns}/${idStr}.json`;
}

export async function loadPattern(id: number) {
    try {
        const content = await readFile(getFilepath(id), 'utf8');
        const pattern = JSON.parse(content.toString());
        // Fill missing step to pattern
        pattern.steps = [
            ...pattern.steps,
            ...Array.from({ length: MAX_STEPS_IN_PATTERN - pattern.steps.length }, () => []),
        ];
        return pattern;
    } catch (error) {}
    return defaultPattern(id);
}

export function savePattern(pattern: Pattern) {
    return writeFile(getFilepath(pattern.id), JSON.stringify(pattern));
}

export async function reloadPattern(id: number) {
    patterns[id] = await loadPattern(id);
}

export async function loadPatterns() {
    for (let id = 0; id < PATTERN_COUNT; id++) {
        patterns.push(await loadPattern(id));
    }
}
