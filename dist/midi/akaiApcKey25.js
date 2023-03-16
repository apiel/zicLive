"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.akaiApcKey25 = void 0;
const padMatrix = [
    [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27],
    [0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f],
    [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17],
    [0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f],
    [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07],
];
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
// #3151C6 92
// #B21A7D 82
// #004152 38
// #005735 65
// #A00000 120
// #FF5400 9
// Color Velocity Color Velocity Color Velocity
// #000000 0 #142B00 19 #004152 38
// #1E1E1E 1 #4CFF4C 20 #001019 39
// #7F7F7F 2 #00FF00 21 #4C88FF 40
// #FFFFFF 3 #005900 22 #0055FF 41
// #FF4C4C 4 #001900 23 #001D59 42
// #FF0000 5 #4CFF5E 24 #000819 43
// #590000 6 #00FF19 25 #4C4CFF 44
// #190000 7 #00590D 26 #0000FF 45
// #FFBD6C 8 #001902 27 #000059 46
// #FF5400 9 #4CFF88 28 #000019 47
// #591D00 10 #00FF55 29 #874CFF 48
// #271B00 11 #00591D 30 #5400FF 49
// #FFFF4C 12 #001F12 31 #190064 50
// #FFFF00 13 #4CFFB7 32 #0F0030 51
// #595900 14 #00FF99 33 #FF4CFF 52
// #191900 15 #005935 34 #FF00FF 53
// #88FF4C 16 #001912 35 #590059 54
// #54FF00 17 #4CC3FF 36 #190019 55
// #1D5900 18 #00A9FF 37 #FF4C87 56
// #FF0054 57 #88E106 85 #DCFF6B 113
// #59001D 58 #72FF15 86 #80FFBD 114
// #220013 59 #00FF00 87 #9A99FF 115
// #FF1500 60 #3BFF26 88 #8E66FF 116
// #993500 61 #59FF71 89 #404040 117
// #795100 62 #38FFCC 90 #757575 118
// #436400 63 #5B8AFF 91 #E0FFFF 119
// #033900 64 #3151C6 92 #A00000 120
// #005735 65 #877FE9 93 #350000 121
// #00547F 66 #D31DFF 94 #1AD000 122
// #0000FF 67 #FF005D 95 #074200 123
// #00454F 68 #FF7F00 96 #B9B000 124
// #2500CC 69 #B9B000 97 #3F3100 125
// #7F7F7F 70 #90FF00 98 #B35F00 126
// #202020 71 #835D07 99 #4B1502 127
// #FF0000 72 #392b00 100 #404040 117
// #BDFF2D 73 #144C10 101 #757575 118
// #AFED06 74 #0D5038 102 #E0FFFF 119
// #64FF09 75 #15152A 103 #A00000 120
// #108B00 76 #16205A 104 #350000 121
// #00FF87 77 #693C1C 105 #1AD000 122
// #00A9FF 78 #A8000A 106 #074200 123
// #002AFF 79 #DE513D 107 #B9B000 124
// #3F00FF 80 #D86A1C 108 #3F3100 125
// #7A00FF 81 #FFE126 109 #B35F00 126
// #B21A7D 82 #9EE12F 110 #4B1502 127
// #402100 83 #67B50F 111
// #FF4A00 84 #1E1E30 112
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
// sustain 0x40 port keynoard
const knob = {
    k1: 0x30,
    k2: 0x31,
    k3: 0x32,
    k4: 0x33,
    k5: 0x34,
    k6: 0x35,
    k7: 0x36,
    k8: 0x37,
};
exports.akaiApcKey25 = {
    pad,
    knob,
    padMode,
    padMatrix,
};
