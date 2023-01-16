export interface Step {
    note: number;
    velocity: number;
    tie: boolean;
    condition?: number;
}

export interface Pattern {
    id: number;
    stepCount: number;
    steps: Step[][];
}

export const defaultPattern = (id = 0): Pattern => ({
    id,
    stepCount: 16,
    steps: Array.from({ length: 16 }, () => []),
});

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
