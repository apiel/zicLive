"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencerEditEventHandler = exports.drawStep = exports.sequencerEditView = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const events_1 = require("../events");
const selector_1 = require("../selector");
const style_1 = require("../style");
const sequence_1 = require("../sequence");
const patch_1 = require("../patch");
const track_1 = require("../track");
const util_1 = require("../util");
const zic_node_1 = require("zic_node");
const def_1 = require("../def");
const drawField_1 = require("../draw/drawField");
const drawButton_1 = require("../draw/drawButton");
const sequencesRow_node_1 = require("../nodes/sequencesRow.node");
const rowNext_1 = require("../draw/rowNext");
const drawMessage_1 = require("../draw/drawMessage");
const drawSelectable_1 = require("../draw/drawSelectable");
const tonal_1 = require("tonal");
const drawSeparator_1 = require("../draw/drawSeparator");
let scrollY = 0;
const col = config_1.config.screen.col;
// TODO #50 in sequencer Editer optimize rendering and draw only visible items
async function sequencerEditView(options = {}) {
    (0, selector_1.cleanSelectableItems)();
    (0, zic_node_ui_1.clear)(style_1.color.background);
    const selectedId = (0, sequence_1.getSelectedSequenceId)();
    (0, rowNext_1.rowReset)();
    let _sequences = sequence_1.sequences;
    if (selectedId === -1) {
        _sequences = sequence_1.sequences.slice(-2);
    }
    else {
        if (selectedId > 0) {
            _sequences = sequence_1.sequences.slice(selectedId - 1);
        }
        const itemIndex = (0, selector_1.getSelectedIndex)();
        if (itemIndex < config_1.config.sequence.col) {
            const index = _sequences.findIndex((s) => s.id === selectedId);
            if (index !== -1 && index != itemIndex) {
                (0, selector_1.forceSelectedItem)(def_1.View.SequencerEdit, index);
            }
        }
    }
    (0, sequencesRow_node_1.sequencesRowNode)(scrollY, (id) => ({
        onSelected: () => {
            (0, sequence_1.setSelectedSequenceId)(id);
            (0, selector_1.forceSelectedItem)(def_1.View.Sequencer, id);
        },
        priority: id === selectedId,
    }), _sequences, { selectedId });
    (0, rowNext_1.rowAdd)(2);
    (0, zic_node_ui_1.setColor)(style_1.color.foreground);
    if (selectedId === -1) {
        (0, drawButton_1.drawButton)('New sequence', (0, rowNext_1.rowNext)(1), sequence_1.newSequence);
        return;
    }
    const { trackId, detune, repeat, nextSequenceId, stepCount, steps } = sequence_1.sequences[selectedId];
    const track = (0, track_1.getTrack)(trackId);
    const engine = config_1.config.engines[track.engine];
    // TODO should id be a string??? 5-7 char
    (0, drawField_1.drawField)(`Sequence`, `#${selectedId + 1}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            const id = (0, util_1.minmax)(selectedId + direction, 0, sequence_1.sequences.length - 1);
            (0, sequence_1.setSelectedSequenceId)(id);
            (0, selector_1.forceSelectedItem)(def_1.View.Sequencer, id);
        },
    }, {
        valueColor: (0, track_1.getTrackColor)(trackId),
        scrollY,
    });
    (0, drawField_1.drawField)(`Track`, track.name, (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            sequence_1.sequences[selectedId].trackId = (0, util_1.minmax)(trackId + direction, 0, (0, track_1.getTrackCount)() - 1);
        },
    }, {
        col,
        scrollY,
    });
    (0, drawField_1.drawField)(`Repeat`, `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            sequence_1.sequences[selectedId].repeat = (0, util_1.minmax)(repeat + direction, 0, 16);
        },
    }, {
        scrollY,
    });
    (0, drawField_1.drawField)(`Next`, nextSequenceId ? `${nextSequenceId + 1}` : `---`, (0, rowNext_1.rowNext)(col), {
        edit: (direction) => {
            if (direction !== 0) {
                const ids = sequence_1.sequences.filter((s) => s.trackId === trackId && s.id !== selectedId).map((s) => s.id);
                let idx = nextSequenceId !== undefined ? ids.indexOf(nextSequenceId) : -1;
                idx = (0, util_1.minmax)(idx + direction, -1, ids.length - 1);
                sequence_1.sequences[selectedId].nextSequenceId = idx === -1 ? undefined : ids[idx];
            }
        },
    }, {
        scrollY,
        col,
    });
    (0, drawField_1.drawField)(`Detune`, detune < 0 ? detune.toString() : `+${detune}` + ' semitones', (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            sequence_1.sequences[selectedId].detune = (0, util_1.minmax)(detune + direction, -12, 12);
        },
    }, {
        scrollY,
    });
    (0, rowNext_1.rowAdd)(1);
    (0, drawField_1.drawFieldDual)(``, `Reload`, `Save`, (0, rowNext_1.rowNext)(col), {
        edit: (0, drawMessage_1.withInfo)('Sequence loaded', () => (0, sequence_1.loadSequence)(selectedId)),
    }, {
        edit: (0, drawMessage_1.withSuccess)('Sequences saved', () => (0, sequence_1.saveSequence)(sequence_1.sequences[selectedId])),
    }, { scrollY, col });
    (0, drawSeparator_1.drawSeparator)('Pattern', (0, rowNext_1.rowNext)(1), { scrollY });
    (0, drawField_1.drawField)(`Len`, `${stepCount}`, (0, rowNext_1.rowNext)(1), {
        edit: (direction) => {
            sequence_1.sequences[selectedId].stepCount = (0, util_1.minmax)(stepCount + direction, 1, 64);
        },
    }, { scrollY });
    drawPattern(stepCount, steps, engine);
    (0, drawMessage_1.renderMessage)();
}
exports.sequencerEditView = sequencerEditView;
function drawPattern(stepCount, steps, engine) {
    for (let stepIndex = 0; stepIndex < stepCount; stepIndex++) {
        const step = steps[stepIndex][0];
        // FIXME : draw only visible steps
        // const y = margin * 2 + headerSize.h + scrollY + (margin + size.h) * stepIndex;
        // if (y < config.screen.size.h + size.h) {
        drawStep(step, (0, rowNext_1.rowNext)(1), stepIndex, engine);
        // }
    }
}
function drawStep(step, row, stepIndex, engine) {
    const selectedId = (0, sequence_1.getSelectedSequenceId)();
    const rect = (0, drawField_1.getFieldRect)(row, { scrollY });
    (0, zic_node_ui_1.setColor)(stepIndex % 4 === 0 ? style_1.color.foreground2 : style_1.color.foreground);
    (0, zic_node_ui_1.drawFilledRect)({
        position: { x: rect.position.x + 1, y: rect.position.y + 1 },
        size: { w: rect.size.w - 2, h: rect.size.h - 2 },
    });
    const stepStr = {
        note: '---',
        velocity: '---',
        condition: '---',
        tie: '--',
        patch: '---',
    };
    if (step) {
        stepStr.note = tonal_1.Midi.midiToNoteName(step.note, { sharps: true });
        stepStr.velocity = `${step.velocity.toString().padStart(3, ' ')}`;
        stepStr.condition = step.condition ? sequence_1.STEP_CONDITIONS[step.condition] : sequence_1.STEP_CONDITIONS[0];
        if (step.tie) {
            stepStr.tie = 'Tie';
        }
        stepStr.patch = '#' + step.patchId.toString().padStart(3, '0');
    }
    const y = rect.position.y + 6;
    const onSelected = () => {
        if (step) {
            (0, patch_1.setCurrentPatchId)(step.patchId);
        }
    };
    (0, drawSelectable_1.drawSelectableText)(stepStr.note, { x: rect.position.x + 4, y: y }, { color: style_1.color.info, size: 13, font: style_1.font.bold }, {
        onSelected,
        edit: (direction) => {
            if (step) {
                if (direction < 0 && step.note <= zic_node_1.NOTE_START) {
                    sequence_1.sequences[selectedId].steps[stepIndex][0] = null;
                }
                else {
                    step.note = (0, util_1.minmax)(step.note + direction, zic_node_1.NOTE_START, zic_node_1.NOTE_END);
                }
            }
            else if (direction === 1) {
                // If no already existing step, create one if direction is positive
                const previousStep = sequence_1.sequences[selectedId].steps
                    .slice(0, stepIndex)
                    .reverse()
                    .find((step) => step[0]?.note)?.[0];
                sequence_1.sequences[selectedId].steps[stepIndex][0] = {
                    note: previousStep?.note ?? 60,
                    velocity: 100,
                    tie: false,
                    patchId: previousStep?.patchId ??
                        sequence_1.sequences[selectedId].steps.flat().find((s) => s)?.patchId ??
                        engine.idStart,
                };
            }
        },
        steps: [1, 12],
    });
    (0, drawSelectable_1.drawSelectableText)(stepStr.velocity, 
    // FIXME if moving down, then selection not working well
    { x: rect.position.x + 38, y }, { color: style_1.color.info, size: 12, font: style_1.font.regular }, {
        onSelected,
        edit: (direction) => {
            if (step) {
                step.velocity = (0, util_1.minmax)(step.velocity + direction, 1, 100);
            }
        },
        steps: [1, 5],
    });
    if (step) {
        (0, zic_node_ui_1.drawText)('%', { x: rect.position.x + 61, y }, { color: style_1.color.secondaryInfo, size: 10, font: style_1.font.regular });
    }
    (0, drawSelectable_1.drawSelectableText)(stepStr.tie, { x: rect.position.x + 80, y }, { color: style_1.color.info, size: 12, font: style_1.font.regular }, {
        onSelected,
        edit: () => {
            if (step) {
                step.tie = !step.tie;
            }
        },
    });
    (0, drawSelectable_1.drawSelectableText)(stepStr.condition, { x: rect.position.x + 110, y }, { color: style_1.color.secondaryInfo, size: 12, font: style_1.font.regular }, {
        onSelected,
        edit: (direction) => {
            if (step) {
                step.condition = (0, util_1.minmax)((step?.condition || 0) + direction, 0, sequence_1.STEP_CONDITIONS.length - 1);
            }
        },
    });
    (0, drawSelectable_1.drawSelectableText)(stepStr.patch, { x: rect.position.x + 170, y }, { color: style_1.color.secondaryInfo, size: 12, font: style_1.font.regular }, {
        onSelected,
        edit: (direction) => {
            if (step) {
                step.patchId = (0, util_1.minmax)(step.patchId + direction, engine.idStart, engine.idEnd);
            }
        },
        steps: [1, 10],
    });
}
exports.drawStep = drawStep;
async function sequencerEditEventHandler(events) {
    const editMode = await (0, events_1.getEditMode)(events);
    if (editMode.refreshScreen) {
        await sequencerEditView();
        return true;
    }
    if (editMode.edit) {
        const updated = await (0, events_1.eventEdit)(events);
        if (updated) {
            await sequencerEditView();
            return true;
        }
        return false;
    }
    else {
        const item = (0, events_1.eventSelector)(events);
        if (item) {
            if (item.position.y > config_1.config.screen.size.h - 50) {
                scrollY -= 50;
            }
            else if (item.position.y < 40 && scrollY < 0) {
                scrollY += 50;
            }
            item.options?.onSelected?.();
            await sequencerEditView();
            return true;
        }
    }
    return false;
}
exports.sequencerEditEventHandler = sequencerEditEventHandler;
