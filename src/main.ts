import { existsSync, readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';
import { open, close, getEvents, render, clear, getScreen } from 'zic_node_ui';
import { sequence } from './components/sequence';
import { color } from './style';
import { config } from './config';
import { Track } from './track';

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
    {id: 0, stepCount: 4, steps: [
        [{note: 60, velocity: 100, tie: false}],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
    ]},
    {id: 1, stepCount: 16, steps: [
        [{note: 60, velocity: 100, tie: false}],
        [{note: 62, velocity: 100, tie: false}],
        [{note: 64, velocity: 100, tie: false}],
        [{note: 65, velocity: 100, tie: false}],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [{note: 54, velocity: 100, tie: false}],
        [],
        [],
        [{note: 58, velocity: 100, tie: false}],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [{note: 60, velocity: 100, tie: false}],
    ]},
    {id: 0, stepCount: 32, steps: [
        [{note: 60, velocity: 100, tie: false}],
        [],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
        [{note: 60, velocity: 100, tie: false}],
        [],
    ]},
];

const tracks: Track[] = [
{ id: 0, name: 'Kick' },
{ id: 1, name: 'PD' },
{ id: 2, name: 'Synth' },
{ id: 3, name: 'Bass' },
{ id: 4, name: 'Midi1' },
{ id: 5, name: 'Midi2' },
{ id: 6, name: 'Pad' },
{ id: 7, name: 'Drone' },
];

const playing = [4, 7, 8, 10];
for (let id = 0; id < 21; id++) {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    sequence(id, {
        track: tracks[Math.floor(Math.random() * 8)],
        selected: id === 2,
        playing: playing.includes(id),
        detune: 0,
        repeat: 0,
        pattern,
    });
}
render();

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
