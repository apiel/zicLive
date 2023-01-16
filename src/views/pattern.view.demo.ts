import { exit } from 'process';
import { open, close, getEvents, clear, render } from 'zic_node_ui';
import { color } from '../style';
import { config } from '../config';
import { partternView } from './pattern.view';

open({ size: config.screen.size });

(async function() {
    clear(color.background);
    await partternView(1);
    render();
})();

setInterval(() => {
    const events = getEvents();
    if (events.exit || events.keysDown?.includes(41)) {
        close();
        exit();
    } else if (events.keysDown || events.keysUp) {
        console.log('events', events);
    }
}, 10);
