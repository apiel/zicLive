import { readFile } from 'fs/promises';
import { config } from './config';
import { minmax } from './util';

export const MAX_PATTERNS = 999;

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

export const MAX_VOICES = 4;

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
    steps: Array.from({ length: 16 }, () => []),
});

const patterns: Pattern[] = [];
let patternId: number = 0;

export function getPattern() {
    if (patterns.length === 0) {
        throw new Error('Patterns haven\'t been initialized yet.');
    }
    return patterns[patternId];
}

export function setPatternId(id: number) {
    patternId = minmax(id, 0, MAX_PATTERNS);
}

export async function loadPattern(id: number) {
    const idStr = id.toString().padStart(3, '0');
    try {
        const content = await readFile(`${config.path.patterns}/${idStr}.json`, 'utf8');
        return JSON.parse(content.toString());
    } catch (error) {}
    return defaultPattern(id);
}

export async function loadPatterns() {
    for (let id = 0; id < MAX_PATTERNS; id++) {
        patterns.push(await loadPattern(id));
    }
}
