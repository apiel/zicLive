import { clear, drawFilledRect, Events, setColor } from 'zic_node_ui';
import { config } from '../config';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, forceSelectedItem, getSelectedIndex } from '../selector';
import { color, unit } from '../style';
import {
    getSelectedSequenceId,
    loadSequences,
    newSequence,
    saveSequences,
    sequences,
    setSelectedSequenceId,
} from '../sequence';
import { getPatch, getPatches } from '../patch';
import { getTrack, getTrackColor, getTrackCount } from '../track';
import { minmax } from '../util';
import { PATTERN_COUNT } from 'zic_node';
import { View } from '../def';
import { drawField } from '../draw/drawField';
import { drawButton } from '../draw/drawButton';
import { sequencesRowNode } from '../nodes/sequencesRow.node';
import { rowAdd, rowGet, rowGetAndAdd, rowNext, rowReset } from '../draw/rowNext';
import { RenderOptions } from '../view';

const { margin } = unit;

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
    );
    rowAdd(2);

    setColor(color.foreground);
    drawFilledRect({
        position: { x: margin, y: scrollY + margin + rowGet() * unit.height },
        size: { w: config.screen.size.w - margin * 2, h: config.screen.size.h },
    });

    if (selectedId === -1) {
        drawButton('New sequence', rowGet(), newSequence);
        return;
    }

    const { trackId, patchId, patternId, detune, repeat, nextSequenceId } = sequences[selectedId];

    const track = getTrack(trackId);
    const patches = getPatches(track.engine);
    const patch = getPatch(track.engine, patchId);
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
        `Patch`,
        patch.name,
        rowNext(1),
        {
            edit: (direction) => {
                sequences[selectedId].patchId = minmax(patchId + direction, 0, patches.length - 1);
            },
            steps: [1, 10],
        },
        {
            info: '#' + patchId.toString().padStart(3, '0'),
            scrollY,
        },
    );
    drawField(
        `Pattern`,
        '#' + patternId.toString().padStart(3, '0'),
        rowNext(col),
        {
            edit: (direction) => {
                sequences[selectedId].patternId = minmax(patternId + direction, 0, PATTERN_COUNT - 1);
            },
            steps: [1, 10],
        },
        {
            col,
            scrollY,
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
    drawField(
        `Repeat`,
        `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`,
        rowNext(col),
        {
            edit: (direction) => {
                sequences[selectedId].repeat = minmax(repeat + direction, 0, 16);
            },
        },
        {
            col,
            scrollY,
        },
    );
    drawField(
        `Next`,
        nextSequenceId ? `${nextSequenceId + 1} ${getPatch(track.engine, patchId).name}` : `---`,
        // rowNext(1),
        rowGetAndAdd(1),
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
        },
    );
    drawButton('Reload all', rowNext(1), loadSequences, { scrollY });
    drawButton('Save all', rowNext(col), saveSequences, { col, scrollY });
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
