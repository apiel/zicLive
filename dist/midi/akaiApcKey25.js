"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.akaiApcKey25 = void 0;
// https://cdn.inmusicbrands.com/akai/attachments/APC%20Key%2025%20mk2%20-%20Communication%20Protocol%20-%20v1.1.pdf
const padMatrix = [
    [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27],
    [0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f],
    [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17],
    [0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f],
    [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07],
];
const padMatrixFlat = padMatrix.flat();
const padMode = {
    off: 0x00,
    on10pct: 0x90,
    on25pct: 0x91,
    on50pct: 0x92,
    on65pct: 0x93,
    on75pct: 0x94,
    on90pct: 0x95,
    on100pct: 0x96,
    pulsing1_16: 0x97,
    pulsing1_8: 0x98,
    pulsing1_4: 0x99,
    pulsing1_2: 0x9a,
    blinking1_24: 0x9b,
    blinking1_16: 0x9c,
    blinking1_8: 0x9d,
    blinking1_4: 0x9e,
    blinking1_2: 0x9f,
};
const pad = {
    up: 0x40,
    down: 0x41,
    left: 0x42,
    right: 0x43,
    volume: 0x44,
    pan: 0x45,
    send: 0x46,
    device: 0x47,
    clipStop: 0x52,
    solo: 0x53,
    mute: 0x54,
    recArm: 0x55,
    select: 0x56,
    stopAllClips: 0x51,
    play: 0x5b,
    record: 0x5d,
    shift: 0x62,
};
const keyboardCC = {
    sustain: 0x40,
};
const encoder = {
    k1: 0x30,
    k2: 0x31,
    k3: 0x32,
    k4: 0x33,
    k5: 0x34,
    k6: 0x35,
    k7: 0x36,
    k8: 0x37,
};
const encoderList = [
    { name: 'k1', midiKey: encoder.k1 },
    { name: 'k2', midiKey: encoder.k2 },
    { name: 'k3', midiKey: encoder.k3 },
    { name: 'k4', midiKey: encoder.k4 },
    { name: 'k5', midiKey: encoder.k5 },
    { name: 'k6', midiKey: encoder.k6 },
    { name: 'k7', midiKey: encoder.k7 },
    { name: 'k8', midiKey: encoder.k8 },
];
exports.akaiApcKey25 = {
    pad,
    encoder,
    encoderList,
    padMode,
    padMatrix,
    padMatrixFlat,
    keyboardCC,
};
