import { clear, drawFilledRect, drawText, Events, setColor } from 'zic_node_ui';
import { config } from '../config';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, forceSelectedItem, getSelectedIndex } from '../selector';
import { color, font } from '../style';
import {
    getSelectedSequenceId,
    loadSequence,
    newSequence,
    saveSequence,
    sequences,
    setSelectedSequenceId,
    Step,
    Steps,
    STEP_CONDITIONS,
} from '../sequence';
import { getPatch, getPatches, Patch } from '../patch';
import { getTrack, getTrackColor, getTrackCount } from '../track';
import { minmax } from '../util';
import { NOTE_END, NOTE_START } from 'zic_node';
import { View } from '../def';
import { drawField, drawFieldDual, getFieldRect } from '../draw/drawField';
import { drawButton } from '../draw/drawButton';
import { sequencesRowNode } from '../nodes/sequencesRow.node';
import { rowAdd, rowNext, rowReset } from '../draw/rowNext';
import { RenderOptions } from '../view';
import { renderMessage, withInfo, withSuccess } from '../draw/drawMessage';
import { drawSelectableText } from '../draw/drawSelectable';
import { Midi } from 'tonal';
import { drawSeparator } from '../draw/drawSeparator';

let scrollY = 0;
const col = config.screen.col;

// TODO #50 in sequencer Editer optimize rendering and draw only visible items
export async function sequencerEditView(options: RenderOptions = {}) {
    cleanSelectableItems();
    clear(color.background);

    const selectedId = getSelectedSequenceId();
    rowReset();

    let _sequences = sequences;
    if (selectedId === -1) {
        _sequences = sequences.slice(-2);
    } else {
        if (selectedId > 0) {
            _sequences = sequences.slice(selectedId - 1);
        }
        const itemIndex = getSelectedIndex();
        if (itemIndex < config.sequence.col) {
            const index = _sequences.findIndex((s) => s.id === selectedId);
            if (index !== -1 && index != itemIndex) {
                forceSelectedItem(View.SequencerEdit, index);
            }
        }
    }
    sequencesRowNode(
        scrollY,
        (id) => ({
            onSelected: () => {
                setSelectedSequenceId(id);
                forceSelectedItem(View.Sequencer, id);
            },
            priority: id === selectedId,
        }),
        _sequences,
        { selectedId },
    );

    rowAdd(2);

    setColor(color.foreground);

    if (selectedId === -1) {
        drawButton('New sequence', rowNext(1), newSequence);
        return;
    }

    const { trackId, patchId, detune, repeat, nextSequenceId, stepCount, steps } = sequences[selectedId];

    const track = getTrack(trackId);
    const patches = getPatches(track.engine);
    const patch = getPatch(track.engine, patchId);

    // TODO should id be a string??? 5-7 char
    drawField(
        `Sequence`,
        `#${selectedId + 1}`,
        rowNext(1),
        {
            edit: (direction) => {
                const id = minmax(selectedId + direction, 0, sequences.length - 1);
                setSelectedSequenceId(id);
                forceSelectedItem(View.Sequencer, id);
            },
        },
        {
            valueColor: getTrackColor(trackId),
            scrollY,
        },
    );
    drawField(
        `Track`,
        track.name,
        rowNext(col),
        {
            edit: (direction) => {
                sequences[selectedId].trackId = minmax(trackId + direction, 0, getTrackCount() - 1);
            },
        },
        {
            col,
            scrollY,
        },
    );

    drawField(
        `Repeat`,
        `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`,
        rowNext(1),
        {
            edit: (direction) => {
                sequences[selectedId].repeat = minmax(repeat + direction, 0, 16);
            },
        },
        {
            scrollY,
        },
    );
    drawField(
        `Next`,
        nextSequenceId ? `${nextSequenceId + 1} ${getPatch(track.engine, patchId).name}` : `---`,
        rowNext(col),
        {
            edit: (direction) => {
                if (direction !== 0) {
                    const ids = sequences.filter((s) => s.trackId === trackId && s.id !== selectedId).map((s) => s.id);
                    let idx = nextSequenceId !== undefined ? ids.indexOf(nextSequenceId) : -1;
                    idx = minmax(idx + direction, -1, ids.length - 1);
                    sequences[selectedId].nextSequenceId = idx === -1 ? undefined : ids[idx];
                }
            },
        },
        {
            scrollY,
            col,
        },
    );

    drawField(
        `Detune`,
        detune < 0 ? detune.toString() : `+${detune}` + ' semitones',
        rowNext(1),
        {
            edit: (direction) => {
                sequences[selectedId].detune = minmax(detune + direction, -12, 12);
            },
        },
        {
            scrollY,
        },
    );

    rowAdd(1);

    drawFieldDual(
        ``,
        `Reload`,
        `Save`,
        rowNext(col),
        {
            edit: withInfo('Sequence loaded', () => loadSequence(selectedId)),
        },
        {
            edit: withSuccess('Sequences saved', () => saveSequence(sequences[selectedId])),
        },
        { scrollY, col },
    );

    drawSeparator('Pattern', rowNext(1), { scrollY });

    drawField(
        `Len`,
        `${stepCount}`,
        rowNext(1),
        {
            edit: (direction) => {
                sequences[selectedId].stepCount = minmax(stepCount + direction, 1, 64);
            },
        },
        { scrollY },
    );

    // FIXME make patchId per step
    drawPattern(stepCount, steps, patchId, patches);

    renderMessage();
}

function drawPattern(stepCount: number, steps: Steps, patchId: number, patches: Patch[]) {
    for (let stepIndex = 0; stepIndex < stepCount; stepIndex++) {
        const step = steps[stepIndex][0];
        // FIXME : draw only visible steps
        // const y = margin * 2 + headerSize.h + scrollY + (margin + size.h) * stepIndex;
        // if (y < config.screen.size.h + size.h) {
        drawStep(step, rowNext(1), stepIndex, patchId, patches);
        // }
    }
}

export function drawStep(step: Step | null, row: number, stepIndex: number, patchId: number, patches: Patch[]) {
    const selectedId = getSelectedSequenceId();
    const rect = getFieldRect(row, { scrollY });

    setColor(stepIndex % 4 === 0 ? color.foreground2 : color.foreground);
    drawFilledRect({
        position: { x: rect.position.x + 1, y: rect.position.y + 1 },
        size: { w: rect.size.w - 2, h: rect.size.h - 2 },
    });

    const stepStr = {
        note: '---',
        velocity: '---',
        condition: '---',
        tie: '--',
    };
    if (step) {
        stepStr.note = Midi.midiToNoteName(step.note, { sharps: true });
        stepStr.velocity = `${step.velocity.toString().padStart(3, ' ')}`;
        stepStr.condition = step.condition ? STEP_CONDITIONS[step.condition] : STEP_CONDITIONS[0];
        if (step.tie) {
            stepStr.tie = 'Tie';
        }
    }

    const y = rect.position.y + 6;

    drawSelectableText(
        stepStr.note,
        { x: rect.position.x + 4, y: y },
        { color: color.info, size: 13, font: font.bold },
        {
            edit: (direction) => {
                if (step) {
                    if (direction < 0 && step.note <= NOTE_START) {
                        sequences[selectedId].steps[stepIndex][0] = null;
                    } else {
                        step.note = minmax(step.note + direction, NOTE_START, NOTE_END);
                    }
                } else if (direction === 1) {
                    // If no already existing step, create one if direction is positive
                    const previousStep = sequences[selectedId].steps
                        .slice(0, stepIndex)
                        .reverse()
                        .find((step) => step[0]?.note)?.[0];
                    sequences[selectedId].steps[stepIndex][0] = {
                        note: previousStep?.note || 60,
                        velocity: 100,
                        tie: false,
                    };
                }
            },
            steps: [1, 12],
        },
    );

    drawSelectableText(
        stepStr.velocity,
        // FIXME if moving down, then selection not working well
        { x: rect.position.x + 38, y },
        { color: color.info, size: 12, font: font.regular },
        {
            edit: (direction) => {
                if (step) {
                    step.velocity = minmax(step.velocity + direction, 1, 100);
                }
            },
            steps: [1, 5],
        },
    );
    if (step) {
        drawText('%', { x: rect.position.x + 61, y }, { color: color.secondaryInfo, size: 10, font: font.regular });
    }

    drawSelectableText(
        stepStr.tie,
        { x: rect.position.x + 80, y },
        { color: color.info, size: 12, font: font.regular },
        {
            edit: () => {
                if (step) {
                    step.tie = !step.tie;
                }
            },
        },
    );

    drawSelectableText(
        stepStr.condition,
        { x: rect.position.x + 110, y },
        { color: color.secondaryInfo, size: 12, font: font.regular },
        {
            edit: (direction) => {
                if (step) {
                    step.condition = minmax((step?.condition || 0) + direction, 0, STEP_CONDITIONS.length - 1);
                }
            },
        },
    );

    drawSelectableText(
        '#' + patchId.toString().padStart(3, '0'),
        { x: rect.position.x + 170, y },
        { color: color.secondaryInfo, size: 12, font: font.regular },
        {
            edit: (direction) => {
                sequences[selectedId].patchId = minmax(patchId + direction, 0, patches.length - 1);
            },
            steps: [1, 10],
        },
    );
}

export async function sequencerEditEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await sequencerEditView();
        return true;
    }
    if (editMode.edit) {
        const updated = await eventEdit(events);
        if (updated) {
            await sequencerEditView();
            return true;
        }
        return false;
    } else {
        const item = eventSelector(events);
        if (item) {
            if (item.position.y > config.screen.size.h - 50) {
                scrollY -= 50;
            } else if (item.position.y < 40 && scrollY < 0) {
                scrollY += 50;
            }
            item.options?.onSelected?.();
            await sequencerEditView();
            return true;
        }
    }
    return false;
}
