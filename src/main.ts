import { exit } from 'process';
import { open, close, getEvents, clear } from 'zic_node_ui';
import { color } from './style';
import { config } from './config';

open({ size: config.screen.size });

clear(color.background);

setInterval(() => {
    const events = getEvents();
    if (events.exit || events.keysDown?.includes(41)) {
        close();
        exit();
    } else if (events.keysDown || events.keysUp) {
        console.log('events', events);
    }
}, 10);
