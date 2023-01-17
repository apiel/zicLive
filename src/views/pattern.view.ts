import { clear, drawFilledRect, Events, setColor } from 'zic_node_ui';
import { Midi } from 'tonal';
import { patternPreview } from '../components/patternPreview';
import { config } from '../config';
import { getPattern, MAX_VOICES, setPatternId, STEP_CONDITIONS } from '../pattern';
import { color, font } from '../style';
import { cleanSelectableItems } from '../selector';
import { eventEdit, eventSelector, isEditMode } from '../events';
import { drawSelectableText } from '../draw';
import { minmax } from '../util';

let scrollY = 0;
const margin = 1;
const col = 4;
const headerSize = { w: config.screen.size.w - margin * 2, h: 49 };
const size = { w: config.screen.size.w / col - margin, h: 35 };

export async function partternView() {
    const pattern = getPattern();
    const idStr = pattern.id.toString().padStart(3, '0');
    cleanSelectableItems();

    clear(color.background);

    setColor(color.foreground);
    const headerPosition = { x: margin, y: margin + scrollY };
    drawFilledRect({ position: headerPosition, size: headerSize });

    drawSelectableText(
        `ID: ${idStr}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 4 },
        { color: color.primary, size: 14, font: font.bold },
        (direction) => {
            setPatternId(pattern.id + direction);
        },
        [1, 10],
    );

    drawSelectableText(
        `Len: ${pattern.stepCount}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 24 },
        { color: color.info, size: 14, font: font.regular },
        (direction) => {
            pattern.stepCount = minmax(pattern.stepCount + direction, 1, 64);
        }
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
            const step = voices[voice];
            if (step) {
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
                (direction) => {
                    console.log('note', { direction, stepIndex, voice });
                },
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

export async function patternUpdate(events: Events) {
    if (isEditMode(events)) {
        const updated = eventEdit(events);
        if (updated) {
            await partternView();
            return true;
        }
        return false;
    } else {
        const item = eventSelector(events);
        if (item) {
            if (item.position.y > config.screen.size.h - 40) {
                scrollY -= 40;
            } else if (item.position.y < 40 && scrollY < 0) {
                scrollY += 40;
            }
            await partternView();
            return true;
        }
    }
    return false;
}
