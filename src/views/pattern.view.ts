import { readFile } from 'fs/promises';
import {
    clear,
    drawFilledRect,
    drawRect,
    drawText,
    Events,
    Point,
    setColor,
    TextOptions,
} from 'zic_node_ui';
import { Midi } from 'tonal';
import { patternPreview } from '../components/patternPreview';
import { config } from '../config';
import { defaultPattern, MAX_VOICES, STEP_CONDITIONS } from '../pattern';
import { color, font } from '../style';
import { cleanSelectableItems, getSlectedItem, pushSelectableItem } from '../selector';
import {
    eventSelector,
    isEventDownPressed,
    isEventEditPressed,
    isEventEditRelease,
    isEventLeftPressed,
    isEventRightPressed,
    isEventUpPressed,
} from '../events';

let scrollY = 0;
const margin = 1;
const col = 4;
const headerSize = { w: config.screen.size.w - margin * 2, h: 49 };
const size = { w: config.screen.size.w / col - margin, h: 35 };

type EditHandler = (direction: number) => void;

let id = 1;
let editHandler: EditHandler[] = [];

function drawSelectableText(text: string, position: Point, options: TextOptions, edit: EditHandler = () => {}) {
    const rect = drawText(text, position, options);
    const item = pushSelectableItem(rect.position);
    editHandler[item.id] = edit;
    if (item.selected) {
        setColor(color.secondarySelected);
        drawRect({
            position: { x: rect.position.x - 2, y: rect.position.y - 2 },
            size: { w: rect.size.w + 4, h: rect.size.h + 3 },
        });
    }
}

export async function partternView() {
    const idStr = id.toString().padStart(3, '0');

    let pattern = defaultPattern(id);
    try {
        const content = await readFile(`${config.path.patterns}/${idStr}.json`, 'utf8');
        pattern = JSON.parse(content.toString());
    } catch (error) {}
    cleanSelectableItems();
    editHandler = [];

    clear(color.background);

    setColor(color.foreground);
    const headerPosition = { x: margin, y: margin + scrollY };
    drawFilledRect({ position: headerPosition, size: headerSize });

    drawSelectableText(
        `ID: ${idStr}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 4 },
        { color: color.primary, size: 14, font: font.bold },
        (direction) => {
            console.log('direction', direction);
        }
    );

    drawSelectableText(
        `Len: ${pattern.stepCount}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 24 },
        { color: color.info, size: 14, font: font.regular },
    );

    patternPreview({ x: 100, y: headerPosition.y + 4 }, { w: 300, h: 40 }, pattern);

    for (let stepIndex = 0; stepIndex < pattern.stepCount; stepIndex++) {
        const voices = pattern.steps[stepIndex];
        for (let voice = 0; voice < MAX_VOICES; voice++) {
            const position = {
                x: margin + (margin + size.w) * (voice % col),
                y: margin * 2 + headerSize.h + scrollY + (margin + size.h) * stepIndex,
            };
            setColor(color.foreground);
            drawFilledRect({ position, size });

            const stepStr = {
                note: '---',
                velocity: '----',
                condition: '---',
                tie: '     ',
            };
            if (voices[voice]) {
                const step = voices[voice];
                stepStr.note = Midi.midiToNoteName(step.note, { sharps: true });
                stepStr.velocity = `${step.velocity.toString().padStart(3, ' ')}%`;
                stepStr.condition = step.condition
                    ? STEP_CONDITIONS[step.condition]
                    : STEP_CONDITIONS[0];
                if (step.tie) {
                    stepStr.tie = 'Tie';
                }
            }

            drawSelectableText(
                stepStr.note,
                { x: position.x + 2, y: position.y + 1 },
                { color: color.info, size: 14, font: font.bold },
            );

            drawSelectableText(
                stepStr.velocity,
                { x: position.x + 35, y: position.y + 1 },
                { color: color.info, size: 12, font: font.regular },
            );

            drawSelectableText(
                stepStr.tie,
                { x: position.x + 82, y: position.y + 1 },
                { color: color.info, size: 12, font: font.regular },
            );

            drawSelectableText(
                stepStr.condition,
                { x: position.x + 35, y: position.y + 18 },
                { color: color.secondaryInfo, size: 12, font: font.regular },
            );
        }
    }
}

let editPressed = false;
export async function patternUpdate(events: Events) {
    if (isEventEditPressed(events)) {
        editPressed = true;
    }
    if (editPressed && isEventEditRelease(events)) {
        // console.log('EditReleased');
        editPressed = false;
    }

    if (editPressed) {
        const item = getSlectedItem();
        const edit = editHandler[item.id];
        if (isEventUpPressed(events)) {
            edit(-1);
        } else if (isEventDownPressed(events)) {
            edit(+1);
        } else if (isEventLeftPressed(events)) {
            edit(-1);
        } else if (isEventRightPressed(events)) {
            edit(+1);
        } else {
            return false;
        }
    } else {
        const item = eventSelector(events);
        if (item) {
            if (item.y > config.screen.size.h - 40) {
                scrollY -= 40;
            } else if (item.y < 40 && scrollY < 0) {
                scrollY += 40;
            }
            await partternView();
            return true;
        }
    }
    return false;
}
