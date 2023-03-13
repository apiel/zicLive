export declare const playing: number[];
export interface Step {
    note: number;
    velocity: number;
    tie: boolean;
    patchId: number;
    condition?: number;
}
export declare const STEP_CONDITIONS: string[];
export declare enum StepCondition {
    All = 0,
    Pair = 1,
    Fourth = 2,
    Sixth = 3,
    Eighth = 4,
    Impair = 5,
    OnePercent = 6,
    TwoPercent = 7,
    FivePercent = 8,
    TenPercent = 9,
    TwentyPercent = 10,
    ThirtyPercent = 11,
    FortyPercent = 12,
    FiftyPercent = 13,
    SixtyPercent = 14,
    SeventyPercent = 15,
    EightyPercent = 16,
    NinetyPercent = 17,
    NinetyFivePercent = 18
}
export type Steps = (Step | null)[][];
export interface Sequence {
    id: number;
    trackId: number;
    playing: boolean;
    detune: number;
    repeat: number;
    nextSequenceId?: number;
    activeStep?: number;
    stepCount: number;
    steps: Steps;
}
export declare let sequences: Sequence[];
export declare function getSequence(id: number): Sequence;
export declare function getPlayingSequence(trackId: number): Sequence | undefined;
export declare function getPlayingSequencesForPatch(patchId: number): Sequence[];
export declare function getSequencesForPatchId(patchId: number): Sequence[];
export declare function cleanActiveStep(trackId: number): void;
export declare function playSequence(sequence: Sequence, playing?: boolean, next?: boolean): void;
export declare function toggleSequence(sequence: Sequence): void;
export declare function loadSequence(id: number): Promise<void>;
export declare function loadSequences(): Promise<void>;
export declare function saveSequence(sequence: Sequence): Promise<void>;
export declare function saveSequences(): Promise<void>;
export declare function newSequence(): void;
export declare function getSelectedSequenceId(): number;
export declare function getSelectedSequence(): Sequence;
export declare function setSelectedSequenceId(id: number): void;
export declare function incSelectedSequenceId(direction: number): void;
//# sourceMappingURL=sequence.d.ts.map