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