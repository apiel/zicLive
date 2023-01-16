import { existsSync, readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';
import { open, close, getEvents, render, clear, getScreen } from 'zic_node_ui';
import { sequence } from './sequence';
import { color } from '../style';
import { config } from '../config';
import { Track } from '../track';
import { Patch } from '../patch';

const screenFile = 'screen.json';

const screenConfig = existsSync(screenFile)
    ? JSON.parse(readFileSync(screenFile).toString())
    : undefined;

if (screenConfig) {
    open({
        position: { x: screenConfig.position.x, y: screenConfig.position.y - 35 },
        size: config.screen.size,
    });
} else {
    open({ size: config.screen.size });
}

clear(color.background);

const patterns = [
    {
        id: 0,
        stepCount: 4,
        steps: [
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
        ],
    },
    {
        id: 1,
        stepCount: 16,
        steps: [
            [{ note: 60, velocity: 100, tie: false }],
            [{ note: 62, velocity: 100, tie: false }],
            [{ note: 64, velocity: 100, tie: false }],
            [{ note: 65, velocity: 100, tie: false }],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [{ note: 54, velocity: 100, tie: false }],
            [],
            [],
            [{ note: 58, velocity: 100, tie: false }],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [{ note: 60, velocity: 100, tie: false }],
        ],
    },
    {
        id: 0,
        stepCount: 32,
        steps: [
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
            [{ note: 60, velocity: 100, tie: false }],
            [],
        ],
    },
];

const tracks: Track[] = [
    { id: 0, color: color.tracks[0] },
    { id: 1, color: color.tracks[1] },
    { id: 2, color: color.tracks[2] },
    { id: 3, color: color.tracks[3] },
    { id: 4, color: color.tracks[4] },
    { id: 5, color: color.tracks[5] },
    { id: 6, color: color.tracks[6] },
    { id: 7, color: color.tracks[7] },
];

const patches: Patch[] = [
    { name: 'Kick' },
    { name: 'Organic' },
    { name: 'Melo' },
    { name: 'Bass' },
    { name: 'Midi ch1' },
    { name: 'Midi ch2' },
    { name: 'Psy' },
    { name: 'Drone' },
];
const presets = [
    { id: 23 },
    { id: 79 },
    { id: 12 },
    { id: 45 },
    { id: 67 },
    { id: 89 },
    { id: 34 },
    { id: 56 },
];

const playing = [4, 7, 8, 10];
let stepCounter = 0;

let seqProps: any = [];
for (let id = 0; id < 21; id++) {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    seqProps[id] = {
        track: tracks[Math.floor(Math.random() * 8)],
        selected: id === 2,
        playing: playing.includes(id),
        detune: 0,
        repeat: 0,
        pattern,
        nextSequenceId: Math.random() > 0.5 ? Math.floor(Math.random() * 16) : undefined,
        patch: patches[Math.floor(Math.random() * patches.length)],
        preset: presets[Math.floor(Math.random() * presets.length)],
    };
}

setInterval(() => {
    stepCounter++;
    if (stepCounter > 10000) { // just because
        stepCounter = 0;
    }
    demoSequence();
}, 150);
demoSequence();
function demoSequence() {
    for (let id = 0; id < 21; id++) {
        sequence(id, {...seqProps[id], activeStep: stepCounter % seqProps[id].pattern.stepCount});
    }
    render();
}

setInterval(() => {
    const events = getEvents();
    if (events.exit || events.keysDown?.includes(41)) {
        writeFileSync(screenFile, JSON.stringify(getScreen(), null, 4));
        close();
        exit();
    } else if (events.keysDown || events.keysUp) {
        console.log('events', events);
    }
}, 10);
