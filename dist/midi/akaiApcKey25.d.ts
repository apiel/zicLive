export type EncoderCount = 8;
export declare const akaiApcKey25: {
    pad: {
        up: number;
        down: number;
        left: number;
        right: number;
        volume: number;
        pan: number;
        send: number;
        device: number;
        clipStop: number;
        solo: number;
        mute: number;
        recArm: number;
        select: number;
        stopAllClips: number;
        play: number;
        record: number;
        shift: number;
    };
    encoder: {
        k1: number;
        k2: number;
        k3: number;
        k4: number;
        k5: number;
        k6: number;
        k7: number;
        k8: number;
    };
    encoderList: [{
        name: string;
        midiKey: number;
    }, {
        name: string;
        midiKey: number;
    }, {
        name: string;
        midiKey: number;
    }, {
        name: string;
        midiKey: number;
    }, {
        name: string;
        midiKey: number;
    }, {
        name: string;
        midiKey: number;
    }, {
        name: string;
        midiKey: number;
    }, {
        name: string;
        midiKey: number;
    }];
    padMode: {
        off: number;
        on10pct: number;
        on25pct: number;
        on50pct: number;
        on65pct: number;
        on75pct: number;
        on90pct: number;
        on100pct: number;
        pulsing1_16: number;
        pulsing1_8: number;
        pulsing1_4: number;
        pulsing1_2: number;
        blinking1_24: number;
        blinking1_16: number;
        blinking1_8: number;
        blinking1_4: number;
        blinking1_2: number;
    };
    padMatrix: number[][];
    padMatrixFlat: number[];
    keyboardCC: {
        sustain: number;
    };
};
//# sourceMappingURL=akaiApcKey25.d.ts.map