import { exit } from 'process';
import { getAllSequencerStates, setOnBeatCallback, start } from 'zic_node';
import { open, close, getEvents, render, minimize } from 'zic_node_ui';
import { config } from './config';
import { beatViews } from './def';
import { drawError, renderMessage } from './draw/drawMessage';
import { loadPatches } from './patch';
import { cleanActiveStep, getSequence, loadSequences, setSelectedSequenceId } from './sequence';
import { loadTracks } from './track';
import { startClient, startServer } from './tcp';
import { getView, renderView, viewEventHandler } from './view';
import './midi'

open({ size: config.screen.size });
start();

if (process.argv.includes('--server')) {
    startServer();
}

if (process.argv.includes('--client')) {
    const host = process.argv[process.argv.indexOf('--client') + 1];
    startClient(host);
}

(async function () {
    await loadTracks();
    await loadPatches();
    await loadSequences();
    setSelectedSequenceId(0);
    setOnBeatCallback(async () => {
        try {
            const states = getAllSequencerStates();
            for (let trackId = 0; trackId < states.length; trackId++) {
                const {
                    currentStep,
                    current: { dataId, playing },
                } = states[trackId];
                cleanActiveStep(trackId);
                if (playing) {
                    const sequence = getSequence(dataId);
                    if (sequence) {
                        sequence.activeStep = currentStep;
                        // console.log('currentStep', currentStep);
                    }
                }
            }
            if (beatViews.includes(getView() as any)) {
                await renderView({ beatRendering: true });
                render();
            }
        } catch (error) {
            console.error(error);
            drawError((error as any).message);
            renderMessage();
            render();
        }
    });
    await renderView();
    render();
})();

setInterval(async () => {
    try {
        const events = getEvents();
        // 41=Esc
        if (events.exit || events.keysDown?.includes(41)) {
            close();
            exit();
            // 224=Ctrl 44=Space
        } else if (events.keysDown?.includes(224) || events.keysDown?.includes(44)) {
            minimize();
        } else if (events.keysDown || events.keysUp) {
            if (await viewEventHandler(events)) {
                render();
            }
        }
    } catch (error) {
        console.error(error);
        drawError((error as any).message);
        renderMessage();
        render();
    }
}, 10);
