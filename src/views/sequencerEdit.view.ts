import { clear, drawFilledRect, drawRect, Events, setColor } from 'zic_node_ui';
import { config } from '../config';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { color, unit } from '../style';
import { sequencerNode } from '../nodes/sequencer.node';
import { drawButton, drawField } from '../draw';
import { sequenceRect } from '../nodes/sequence.node';
import {
    getSelectedSequenceId,
    loadSequence,
    loadSequences,
    saveSequences,
    sequences,
    setSelectedSequenceId,
} from '../sequence';
import { getPatch, getPatches, getPreset } from '../patch';
import { getTrack, getTrackColor, getTrackCount } from '../track';
import { minmax } from '../util';
import { PATTERN_COUNT } from 'zic_node';

const { margin } = unit;

let scrollY = 0;
const col = 2;

export async function sequencerEditView() {
    cleanSelectableItems();
    clear(color.background);
    sequencerNode(col, scrollY, setSelectedSequenceId);

    const selectedId = getSelectedSequenceId();
    const selectedRect = sequenceRect(selectedId, col, scrollY);

    setColor(color.secondarySelected);
    drawRect(selectedRect);

    setColor(color.foreground);
    drawFilledRect({
        position: { x: margin + config.screen.size.w / 2, y: margin },
        size: { w: config.screen.size.w / 2 - margin, h: config.screen.size.h },
    });

    const { trackId, patchId, presetId, patternId, detune, repeat, nextSequenceId } =
        sequences[selectedId];

    const track = getTrack(trackId);
    const patches = getPatches(track.type);
    const patch = getPatch(track.type, patchId);
    let row = 0;
    drawField(
        `Sequence`,
        `#${selectedId + 1}`,
        row++,
        {
            edit: (direction) => {
                setSelectedSequenceId(minmax(selectedId + direction, 0, sequences.length - 1));
            },
        },
        {
            col: 2,
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
            col: 2,
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
            col: 2,
            info: '#' + patchId.toString().padStart(3, '0'),
        },
    );
    drawField(
        `Preset`,
        getPreset(track.type, patchId, presetId).name,
        row++,
        {
            edit: (direction) => {
                sequences[selectedId].presetId = minmax(
                    presetId + direction,
                    0,
                    patch.presets.length - 1,
                );
            },
            steps: [1, 10],
        },
        {
            col: 2,
            valueColor: getTrackColor(trackId),
            info: '#' + presetId.toString().padStart(3, '0'),
        },
    );
    drawField(
        `Pattern`,
        '#' + patternId.toString().padStart(3, '0'),
        row++,
        {
            edit: (direction) => {
                sequences[selectedId].patternId = minmax(
                    patternId + direction,
                    0,
                    PATTERN_COUNT - 1,
                );
            },
            steps: [1, 10],
        },
        {
            col: 2,
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
            col: 2,
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
            col: 2,
        },
    );
    drawField(
        `Next`,
        nextSequenceId
            ? `${nextSequenceId + 1} ${
                  getPreset(track.type, patchId, sequences[nextSequenceId].presetId).name
              }`
            : `---`,
        row++,
        {
            edit: (direction) => {
                if (direction !== 0) {
                    const ids = sequences
                        .filter((s) => s.trackId === trackId && s.id !== selectedId)
                        .map((s) => s.id);
                    let idx = nextSequenceId !== undefined ? ids.indexOf(nextSequenceId) : -1;
                    idx = minmax(idx + direction, -1, ids.length - 1);
                    sequences[selectedId].nextSequenceId = idx === -1 ? undefined : ids[idx];
                }
            },
        },
        {
            col: 2,
        },
    );
    drawButton('Reload', row++, () => loadSequence(selectedId), { col: 2 });
    // drawButton('Save', row++, () => console.log('save'), {col: 2}); // Need to find a solution to fill the gaps
    drawButton('Reload all', row++, loadSequences, { col: 2 });
    drawButton('Save all', row++, saveSequences, { col: 2 });
    // drawButton('Delete', row++, () => console.log('delete'), {col: 2});
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
