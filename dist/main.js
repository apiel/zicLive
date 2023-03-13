"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const zic_node_1 = require("zic_node");
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("./config");
const def_1 = require("./def");
const drawMessage_1 = require("./draw/drawMessage");
const patch_1 = require("./patch");
const sequence_1 = require("./sequence");
const track_1 = require("./track");
const view_1 = require("./view");
require("./midi");
(0, zic_node_ui_1.open)({ size: config_1.config.screen.size });
(0, zic_node_1.start)();
(async function () {
    await (0, track_1.loadTracks)();
    await (0, patch_1.loadPatches)();
    await (0, sequence_1.loadSequences)();
    (0, sequence_1.setSelectedSequenceId)(0);
    (0, zic_node_1.setOnBeatCallback)(async () => {
        try {
            const states = (0, zic_node_1.getAllSequencerStates)();
            for (let trackId = 0; trackId < states.length; trackId++) {
                const { currentStep, current: { dataId, playing }, } = states[trackId];
                (0, sequence_1.cleanActiveStep)(trackId);
                if (playing) {
                    const sequence = (0, sequence_1.getSequence)(dataId);
                    if (sequence) {
                        sequence.activeStep = currentStep;
                        // console.log('currentStep', currentStep);
                    }
                }
            }
            if (def_1.beatViews.includes((0, view_1.getView)())) {
                await (0, view_1.renderView)({ beatRendering: true });
                (0, zic_node_ui_1.render)();
            }
        }
        catch (error) {
            console.error(error);
            (0, drawMessage_1.drawError)(error.message);
            (0, drawMessage_1.renderMessage)();
            (0, zic_node_ui_1.render)();
        }
    });
    await (0, view_1.renderView)();
    (0, zic_node_ui_1.render)();
})();
setInterval(async () => {
    try {
        const events = (0, zic_node_ui_1.getEvents)();
        // 41=Esc
        if (events.exit || events.keysDown?.includes(41)) {
            (0, zic_node_ui_1.close)();
            (0, process_1.exit)();
            // 224=Ctrl 44=Space
        }
        else if (events.keysDown?.includes(224) || events.keysDown?.includes(44)) {
            (0, zic_node_ui_1.minimize)();
        }
        else if (events.keysDown || events.keysUp) {
            if (await (0, view_1.viewEventHandler)(events)) {
                (0, zic_node_ui_1.render)();
            }
        }
    }
    catch (error) {
        console.error(error);
        (0, drawMessage_1.drawError)(error.message);
        (0, drawMessage_1.renderMessage)();
        (0, zic_node_ui_1.render)();
    }
}, 10);
