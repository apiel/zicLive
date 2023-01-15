import { existsSync, readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';
import { open, close, getEvents, render, clear, getScreen } from 'zic_node_ui';
import { sequence } from './components/sequence';
import { color } from './style';
import { config } from './config';

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

const playing = [4,7,8,10];
for (let id = 0; id < 21; id++) {
    sequence(id, { track: Math.floor(Math.random()*8), selected: id === 2, playing: playing.includes(id) });
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
