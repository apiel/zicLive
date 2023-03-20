export declare const DATA_PATH: string;
export declare const config: {
    screen: {
        size: {
            w: number;
            h: number;
        };
        col: 2 | 1;
    };
    path: {
        patches: string;
        tracks: string;
        sequences: string;
        wavetables: string;
    };
    encoder: {
        perRow: number;
    };
    sequence: {
        col: number;
        row: number;
    };
    engines: {
        synth: {
            path: string;
            idStart: number;
            idEnd: number;
            initName: string;
            name: string;
        };
        kick23: {
            path: string;
            idStart: number;
            idEnd: number;
            initName: string;
            name: string;
        };
        midi: {
            path: string;
            idStart: number;
            idEnd: number;
            initName: string;
            name: string;
        };
    };
};
export type EngineType = keyof typeof config.engines;
export type Engine = typeof config.engines[EngineType];
//# sourceMappingURL=config.d.ts.map