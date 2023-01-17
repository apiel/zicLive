import { exit } from 'process';
import { open, close, getEvents, render } from 'zic_node_ui';
import { config } from '../config';
import { partternView, patternUpdate } from './pattern.view';

open({ size: config.screen.size });

(async function() {
    await partternView();
    render();
})();

setInterval(async () => {
    const events = getEvents();
    if (events.exit || events.keysDown?.includes(41)) {
        close();
        exit();
    } else if (events.keysDown || events.keysUp) {
        console.log('events', events);
        if (await patternUpdate(events)) {
            render();
        }
    }
}, 10);
