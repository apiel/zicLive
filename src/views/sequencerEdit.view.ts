import { clear, Color, drawFilledRect, drawRect, drawText, Events, setColor } from 'zic_node_ui';
import { config } from '../config';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, EditHandler, SelectableOptions } from '../selector';
import { color, font } from '../style';
import { sequencerNode } from '../nodes/sequencer.node';
import { drawSelectableRect } from '../draw';
import { height, margin, sequenceRect } from '../nodes/sequence.node';
import { getSelectedSequenceId, sequences, setSelectedSequenceId } from '../sequence';
import { getPatch, getPreset } from '../patch';
import { getTrack, getTrackColor, getTrackCount } from '../track';
import { minmax } from '../util';

const editRect = {
    position: { x: margin + config.screen.size.w / 2, y: margin },
    size: { w: config.screen.size.w / 2 - margin, h: config.screen.size.h },
};

let scrollY = 0;
const col = 2;
const width = config.screen.size.w / 4; // Only show halp screen, so divide by 4 instead of 2

function drawField(
    label: string,
    value: string,
    valueColor: Color,
    row: number,
    selectableOptions: SelectableOptions,
    info?: string,
) {
    const h = (height + margin) / 2;
    const rect = {
        position: { x: editRect.position.x, y: editRect.position.y + row * h },
        size: { w: editRect.size.w, h },
    };

    drawSelectableRect(rect, color.sequencer.selected, selectableOptions);
    drawText(
        label,
        { x: rect.position.x + 2, y: rect.position.y + 2 },
        { size: 14, color: color.info },
    );
    const labelRect = drawText(
        value,
        { x: rect.position.x + 80, y: rect.position.y + 2 },
        { size: 14, color: valueColor },
    );
    if (info) {
        drawText(
            info,
            { x: labelRect.position.x + labelRect.size.w + 2, y: rect.position.y + 6 },
            { size: 10, color: color.info },
        );
    }
}

function drawButton(text: string, row: number, edit: EditHandler) {
    const h = (height + margin) / 2;
    const rect = {
        position: { x: editRect.position.x, y: editRect.position.y + row * h },
        size: { w: editRect.size.w, h },
    };

    drawSelectableRect(rect, color.sequencer.selected, { edit });
    drawText(
        text,
        { x: rect.position.x + 80, y: rect.position.y + 2 },
        { size: 14, color: color.info, font: font.bold },
    );
}

export async function sequencerEditView() {
    cleanSelectableItems();
    clear(color.background);
    sequencerNode(width, col, scrollY, setSelectedSequenceId);

    const selectedId = getSelectedSequenceId();
    const selectedRect = sequenceRect(selectedId, width, col, scrollY);

    setColor(color.secondarySelected);
    drawRect(selectedRect);

    setColor(color.foreground);
    drawFilledRect(editRect);

    const { trackId, patchId, presetId, patternId, detune, repeat, nextSequenceId } =
        sequences[selectedId];

    const track = getTrack(trackId);
    const patch = getPatch(track.type, patchId);
    let row = 0;
    drawField(`Sequence`, `#${selectedId + 1}`, getTrackColor(trackId), row++, {
        // edit: (direction) => {
        //     sequences[selectedId].trackId = minmax(trackId + direction, 0, getTrackCount() - 1);
        // },
    });
    drawField(`Track`, track.name, color.white, row++, {
        edit: (direction) => {
            sequences[selectedId].trackId = minmax(trackId + direction, 0, getTrackCount() - 1);
        },
    });
    drawField(
        `Patch`,
        patch.name,
        color.white,
        row++,
        { edit: () => {} },
        '#' + patchId.toString().padStart(3, '0'),
    );
    drawField(
        `Preset`,
        getPreset(track.type, patchId, presetId).name,
        // color.white,
        getTrackColor(trackId),
        row++,
        { edit: () => {} },
        '#' + presetId.toString().padStart(3, '0'),
    );
    drawField(`Pattern`, '#' + patternId.toString().padStart(3, '0'), color.white, row++, {
        edit: () => {},
    });
    drawField(
        `Detune`,
        detune < 0 ? detune.toString() : `+${detune}` + ' semitones',
        color.white,
        row++,
        { edit: () => {} },
    );
    drawField(`Repeat`, `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`, color.white, row++, {
        edit: () => {},
    });
    drawField(
        `Next`,
        nextSequenceId
            ? `${nextSequenceId} ${
                  getPreset(track.type, patchId, sequences[nextSequenceId].presetId).name
              }`
            : `---`,
        color.white,
        row++,
        { edit: () => {} },
    );
    drawButton('Save', row++, () => console.log('save'));
    drawButton('Reload', row++, () => console.log('reload'));
    // drawButton('Delete', row++, () => console.log('delete'));
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
            await sequencerEditView();
            return true;
        }
    }
    return false;
}
