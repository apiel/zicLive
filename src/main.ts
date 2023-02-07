import { exit } from 'process';
import { getAllSequencerStates, setOnBeatCallback, start, SynthPathIds, trackSetString } from 'zic_node';
import { open, close, getEvents, render, minimize } from 'zic_node_ui';
import { config, DATA_PATH } from './config';
import { beatViews } from './def';
import { drawError, renderMessage } from './draw/drawMessage';
import { loadPatches } from './patch';
import { loadPatterns } from './pattern';
import { cleanActiveStep, getSequence, loadSequences, setSelectedSequenceId } from './sequence';
import { loadTracks } from './track';
import { getView, renderView, viewEventHandler } from './view';

open({ size: config.screen.size });
start();

// FIXME might need to remove this?
trackSetString(0, `${DATA_PATH}/wavetables/0_test.wav`);
trackSetString(1, `${DATA_PATH}/patches/pd/_pd/poly`);
trackSetString(2, `${DATA_PATH}/wavetables/0_test.wav`, SynthPathIds.Osc);
trackSetString(2, `${DATA_PATH}/wavetables/0_test.wav`, SynthPathIds.Lfo1);
trackSetString(2, `${DATA_PATH}/wavetables/0_test.wav`, SynthPathIds.Lfo2);
// trackSetString(1, `${DATA_PATH}/wavetables/ACID_SP.WAV`, SynthPathIds.Osc);
// trackSetString(1, `${DATA_PATH}/wavetables/ACID_SP.WAV`, SynthPathIds.Lfo1);
// trackSetString(1, `${DATA_PATH}/wavetables/ACID_SP.WAV`, SynthPathIds.Lfo2);

(async function () {
    await loadTracks();
    await loadPatches();
    await loadPatterns();
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
