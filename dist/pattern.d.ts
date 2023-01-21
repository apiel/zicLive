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
export declare function getPattern(id?: number): Pattern;
export declare function setPatternId(id: number): void;
export declare function loadPattern(id: number): Promise<any>;
export declare function savePattern(pattern: Pattern): Promise<void>;
export declare function reloadPattern(id: number): Promise<void>;
export declare function loadPatterns(): Promise<void>;
//# sourceMappingURL=pattern.d.ts.map