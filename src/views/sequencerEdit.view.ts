import { clear, Color, drawFilledRect, drawRect, drawText, Events, setColor } from 'zic_node_ui';
import { config } from '../config';
import { eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, EditHandler } from '../selector';
import { color, font } from '../style';
import { sequencerNode } from '../nodes/sequencer.node';
import { drawSelectableRect } from '../draw';
import { height, margin, sequenceRect } from '../nodes/sequence.node';
import { getSelectedSequenceId, sequences, setSelectedSequenceId } from '../sequence';
import { getPatch, getPreset } from '../patch';
import { getTrack, getTrackColor } from '../track';

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
    edit: EditHandler,
    steps?: [number, number],
) {
    const h = (height + margin) / 2;
    const rect = {
        position: { x: editRect.position.x, y: editRect.position.y + row * h },
        size: { w: editRect.size.w, h },
    };

    drawSelectableRect(rect, color.sequencer.selected, edit, steps);
    drawText(
        label,
        { x: rect.position.x + 2, y: rect.position.y + 2 },
        { size: 14, color: color.info },
    );
    drawText(
        value,
        { x: rect.position.x + 80, y: rect.position.y + 2 },
        { size: 14, color: valueColor },
    );
}

function drawButton(text: string, row: number, edit: EditHandler) {
    const h = (height + margin) / 2;
    const rect = {
        position: { x: editRect.position.x, y: editRect.position.y + row * h },
        size: { w: editRect.size.w, h },
    };

    drawSelectableRect(rect, color.sequencer.selected, edit);
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
    drawField(`Track`, `${trackId} ${track.name}`, getTrackColor(trackId), 0, () => {});
    drawField(`Patch`, `${patchId} ${patch.name}`, color.white, 1, () => {});
    drawField(
        `Preset`,
        `${presetId} ${getPreset(track.type, patchId, presetId).name}`,
        color.white,
        2,
        () => {},
    );
    drawField(`Pattern`, patternId.toString().padStart(3, '0'), color.white, 3, () => {});
    drawField(
        `Detune`,
        detune < 0 ? detune.toString() : `+${detune}` + ' semitones',
        color.white,
        4,
        () => {},
    );
    drawField(
        `Repeat`,
        `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`,
        color.white,
        5,
        () => {},
    );
    drawField(
        `Next`,
        nextSequenceId
            ? `${nextSequenceId} ${
                  getPreset(track.type, patchId, sequences[nextSequenceId].presetId).name
              }`
            : `---`,
        color.white,
        6,
        () => {},
    );
    drawButton('Save', 7, () => console.log('save'));
    drawButton('Reload', 8, () => console.log('reload'));
    drawButton('Delete', 9, () => console.log('delete'));
}

export async function sequencerEditEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await sequencerEditView();
        return true;
    }
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
    return false;
}
