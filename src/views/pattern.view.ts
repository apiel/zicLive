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

const itemPerField = 4;

const margin = 1;
const col = 4;
const headerSize = { w: config.screen.size.w - margin * 2, h: 49 };
const size = { w: config.screen.size.w / col - margin, h: 35 };

let selector = 0;
const selectionHeader = 2;
let maxSelection = selectionHeader;

function drawSelectableText(text: string, position: Point, options: TextOptions, selected = false) {
    const rect = drawText(text, position, options);
    if (selected) {
        setColor(color.secondarySelected);
        drawRect({
            position: { x: rect.position.x - 2, y: rect.position.y - 2 },
            size: { w: rect.size.w + 4, h: rect.size.h + 3 },
        });
    }
}

export async function partternView(id: number) {
    const idStr = id.toString().padStart(3, '0');

    let pattern = defaultPattern(id);
    try {
        const content = await readFile(`${config.path.patterns}/${idStr}.json`, 'utf8');
        pattern = JSON.parse(content.toString());
    } catch (error) {}
    maxSelection = pattern.stepCount * itemPerField * MAX_VOICES + selectionHeader;

    clear(color.background);

    setColor(color.foreground);
    const headerPosition = { x: margin, y: margin };
    drawFilledRect({ position: headerPosition, size: headerSize });

    drawSelectableText(
        `ID: ${idStr}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 4 },
        { color: color.primary, size: 14, font: font.bold },
        selector === 0,
    );

    drawSelectableText(
        `Len: ${pattern.stepCount}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 24 },
        { color: color.info, size: 14, font: font.regular },
        selector === 1,
    );

    patternPreview({ x: 100, y: 5 }, { w: 300, h: 40 }, pattern);

    for (let stepIndex = 0; stepIndex < pattern.stepCount; stepIndex++) {
        const voices = pattern.steps[stepIndex];
        for (let voice = 0; voice < MAX_VOICES; voice++) {
            const position = {
                x: margin + (margin + size.w) * (voice % col),
                y: margin * 2 + headerSize.h + (margin + size.h) * stepIndex,
            };
            setColor(color.foreground);
            drawFilledRect({ position, size });

            const step = voices[voice];
            if (step) {
                drawSelectableText(
                    `${Midi.midiToNoteName(step.note, { sharps: true })}`,
                    { x: position.x + 2, y: position.y + 1 },
                    { color: color.info, size: 14, font: font.bold },
                    selector === stepIndex + selectionHeader,
                );

                drawSelectableText(
                    `${step.velocity}%`,
                    { x: position.x + 35, y: position.y + 1 },
                    { color: color.info, size: 12, font: font.regular },
                    false,
                );

                if (step.tie) {
                    drawSelectableText(
                        `Tie`,
                        { x: position.x + 82, y: position.y + 1 },
                        { color: color.info, size: 12, font: font.regular },
                        false,
                    );
                }

                const condition = step.condition
                    ? STEP_CONDITIONS[step.condition]
                    : STEP_CONDITIONS[0];
                drawSelectableText(
                    condition,
                    { x: position.x + 35, y: position.y + 18 },
                    { color: color.secondaryInfo, size: 12, font: font.regular },
                    false,
                );
            }
        }
    }
}

export async function patternUpdate(events: Events) {
    // if (selector < selectionHeader) {
        if (events.keysDown?.includes(82)) {
            selector = (maxSelection + selector - 1) % maxSelection;
        } else if (events.keysUp?.includes(81)) {
            selector = (maxSelection + selector + 1) % maxSelection;
        }
    // }
    await partternView(1);
    return true;
}
