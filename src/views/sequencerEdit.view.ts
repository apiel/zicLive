import { clear, drawFilledRect, drawRect, Events, setColor } from 'zic_node_ui';
import { config } from '../config';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, forceSelectedItem } from '../selector';
import { color, unit } from '../style';
import { sequenceRect, sequencesGridNode } from '../nodes/sequencesGrid.node';
import { getSelectedSequenceId, loadSequences, saveSequences, sequences, setSelectedSequenceId } from '../sequence';
import { getPatch, getPatches } from '../patch';
import { getTrack, getTrackColor, getTrackCount } from '../track';
import { minmax } from '../util';
import { PATTERN_COUNT } from 'zic_node';
import { View } from '../def';
import { drawField } from '../draw/drawField';
import { drawButton } from '../draw/drawButton';
import { getColPosition } from '../draw/getDrawRect';

const { margin } = unit;

let scrollY = 0;
const col = config.screen.col;

// TODO #8 in small screen size there could still be 1 sequences column on side or one row on top

export async function sequencerEditView() {
    cleanSelectableItems();
    clear(color.background);

    const selectedId = getSelectedSequenceId();

    if (col === 2) {
        sequencesGridNode(col, scrollY, (id) => {
            setSelectedSequenceId(id);
            forceSelectedItem(View.Sequencer, id);
        });

        setColor(color.secondarySelected);
        const selectedRect = sequenceRect(selectedId, col, scrollY);
        drawRect({
            ...selectedRect,
            size: { w: selectedRect.size.w + 1, h: selectedRect.size.h + 1 },
        });
    } else {

    }

    setColor(color.foreground);
    drawFilledRect({
        position: { x: getColPosition(col), y: margin },
        size: { w: config.screen.size.w / col - margin, h: config.screen.size.h },
    });

    const { trackId, patchId, patternId, detune, repeat, nextSequenceId } = sequences[selectedId];

    const track = getTrack(trackId);
    const patches = getPatches(track.engine);
    const patch = getPatch(track.engine, patchId);
    let row = 0;
    drawField(
        `Sequence`,
        `#${selectedId + 1}`,
        row++,
        {
            edit: (direction) => {
                const id = minmax(selectedId + direction, 0, sequences.length - 1);
                setSelectedSequenceId(id);
                forceSelectedItem(View.Sequencer, id);
            },
        },
        {
            col,
            valueColor: getTrackColor(trackId),
        },
    );
    drawField(
        `Track`,
        track.name,
        row++,
        {
            edit: (direction) => {
                sequences[selectedId].trackId = minmax(trackId + direction, 0, getTrackCount() - 1);
            },
        },
        {
            col,
        },
    );
    drawField(
        `Patch`,
        patch.name,
        row++,
        {
            edit: (direction) => {
                sequences[selectedId].patchId = minmax(patchId + direction, 0, patches.length - 1);
            },
            steps: [1, 10],
        },
        {
            col,
            info: '#' + patchId.toString().padStart(3, '0'),
        },
    );
    drawField(
        `Pattern`,
        '#' + patternId.toString().padStart(3, '0'),
        row++,
        {
            edit: (direction) => {
                sequences[selectedId].patternId = minmax(patternId + direction, 0, PATTERN_COUNT - 1);
            },
            steps: [1, 10],
        },
        {
            col,
        },
    );
    drawField(
        `Detune`,
        detune < 0 ? detune.toString() : `+${detune}` + ' semitones',
        row++,
        {
            edit: (direction) => {
                sequences[selectedId].detune = minmax(detune + direction, -12, 12);
            },
        },
        {
            col,
        },
    );
    drawField(
        `Repeat`,
        `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`,
        row++,
        {
            edit: (direction) => {
                sequences[selectedId].repeat = minmax(repeat + direction, 0, 16);
            },
        },
        {
            col,
        },
    );
    drawField(
        `Next`,
        nextSequenceId ? `${nextSequenceId + 1} ${getPatch(track.engine, patchId).name}` : `---`,
        row++,
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
            col,
        },
    );
    // drawButton('Reload', row++, () => loadSequence(selectedId), { col });
    // drawButton('Save', row++, () => console.log('save'), {col}); // Need to find a solution to fill the gaps
    // Might want to move this in master view...
    drawButton('Reload all', row++, loadSequences, { col });
    drawButton('Save all', row++, saveSequences, { col });
    // drawButton('Delete', row++, () => console.log('delete'), {col});
    // drawButton('Play/Stop', row++, saveSequences, { col });
    // drawButton('Play/Stop now', row++, saveSequences, { col });
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
            if (item.position.x < config.screen.size.w / 2) {
                if (item.position.y > config.screen.size.h - 50) {
                    scrollY -= 50;
                } else if (item.position.y < 40 && scrollY < 0) {
                    scrollY += 50;
                }
            }
            await sequencerEditView();
            return true;
        }
    }
    return false;
}
