import { exit } from 'process';
import { open, close, getEvents, render, minimize } from 'zic_node_ui';
import { config } from './config';
import { loadPatterns } from './pattern';
import { loadSequences } from './sequencer';
import { renderView, viewEventHandler } from './view';

open({ size: config.screen.size });

(async function () {
    await loadPatterns();
    await loadSequences();
    await renderView();
    render();
})();

setInterval(async () => {
    const events = getEvents();
    // 41=Esc
    if (events.exit || events.keysDown?.includes(41)) {
        close();
        exit();
        // 224=Ctrl 44=Space
    } else if (events.keysDown?.includes(224) || events.keysDown?.includes(44)) {
        minimize();
    } else if (events.keysDown || events.keysUp) {
        // console.log('events', events);
        if (await viewEventHandler(events)) {
            render();
        }
    }
}, 10);

