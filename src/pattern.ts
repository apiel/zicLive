export interface Step {
    note: number;
    velocity: number;
    tie: boolean;
}

export interface Pattern {
    id: number;
    stepCount: number;
    steps: Step[][];
}
