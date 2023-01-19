import { exit } from 'process';
import { start, SynthPathIds, trackSetPath } from 'zic_node';
import { open, close, getEvents, render, minimize } from 'zic_node_ui';
import { config, DATA_PATH } from './config';
import { loadPatches } from './patch';
import { loadPatterns } from './pattern';
import { loadSequences, setSelectedSequenceId } from './sequence';
import { loadTracks } from './track';
import { renderView, viewEventHandler } from './view';

open({ size: config.screen.size });
start();

// FIXME might need to remove this?
trackSetPath(0, `${DATA_PATH}/patches/pd/001`);
trackSetPath(1, `${DATA_PATH}/wavetables/0_test.wav`, SynthPathIds.Osc);
trackSetPath(1, `${DATA_PATH}/wavetables/0_test.wav`, SynthPathIds.Lfo1);
trackSetPath(1, `${DATA_PATH}/wavetables/0_test.wav`, SynthPathIds.Lfo2);

(async function () {
    await loadTracks();
    await loadPatches();
    await loadPatterns();
    await loadSequences();
    setSelectedSequenceId(0);
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
