export declare const playing: number[];
interface Sequence {
    id: number;
    trackId: number;
    playing: boolean;
    detune: number;
    repeat: number;
    patternId: number;
    nextSequenceId?: number;
    patchId: number;
    presetId: number;
    activeStep?: number;
}
export declare let sequences: Sequence[];
export declare function getSequence(id: number): Sequence;
export declare function getPlayingSequence(trackId: number): Sequence | undefined;
export declare function cleanActiveStep(trackId: number): void;
export declare function playSequence(sequence: Sequence, playing?: boolean, next?: boolean): void;
export declare function toggleSequence(sequence: Sequence): void;
export declare function loadSequences(): Promise<void>;
export declare function saveSequences(): Promise<void>;
export declare function newSequence(): void;
export declare function getSelectedSequenceId(): number;
export declare function setSelectedSequenceId(id: number): void;
export {};
//# sourceMappingURL=sequence.d.ts.map