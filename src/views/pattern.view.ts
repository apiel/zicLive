import { clear, drawFilledRect, drawText, Events, Point, setColor } from 'zic_node_ui';
import { Midi } from 'tonal';
import { patternPreviewNode } from '../nodes/patternPreview.node';
import { config } from '../config';
import { getPattern, Pattern, reloadPattern, savePattern, setPatternId, Step, STEP_CONDITIONS } from '../pattern';
import { color, font } from '../style';
import { cleanSelectableItems, pushSelectableItem } from '../selector';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { drawSelectableText } from '../draw/drawSelectable';
import { minmax } from '../util';
import { MAX_VOICES_IN_PATTERN, NOTE_END, NOTE_START } from 'zic_node';
import { RenderOptions } from '../view';

let scrollY = 0;
const margin = 1;
const col = 4;
const headerSize = { w: config.screen.size.w - margin * 2, h: 49 };
const size = { w: config.screen.size.w / col - margin, h: 35 };
const findByColumnFirst = config.screen.col !== 1;

export async function patternView(options: RenderOptions = {}) {
    const pattern = getPattern();
    const idStr = pattern.id.toString().padStart(3, '0');
    cleanSelectableItems();

    clear(color.background);

    const headerPosition = { x: margin, y: margin + scrollY };

    const idPosition = { x: headerPosition.x + 5, y: headerPosition.y + 4 };
    const savePosition = { x: headerPosition.x + 70, y: headerPosition.y + 4 };
    const lenPosition = { x: headerPosition.x + 5, y: headerPosition.y + 24 };
    const reloadPosition = { x: headerPosition.x + 70, y: headerPosition.y + 24 };
    if (headerPosition.y < -headerSize.h) {
        // Not visible no need to draw
        pushSelectableItem(idPosition);
        pushSelectableItem(savePosition);
        pushSelectableItem(lenPosition);
        pushSelectableItem(reloadPosition);
    } else {
        setColor(color.foreground);
        drawFilledRect({ position: headerPosition, size: headerSize });

        drawSelectableText(
            `ID: ${idStr}`,
            idPosition,
            { color: color.primary, size: 14, font: font.bold },
            { edit: (direction) => setPatternId(pattern.id + direction), steps: [1, 10] },
        );

        drawSelectableText(
            `Save`,
            savePosition,
            { color: color.info, size: 14, font: font.regular },
            { edit: async () => savePattern(pattern) },
        );

        drawSelectableText(
            `Len: ${pattern.stepCount}`,
            lenPosition,
            { color: color.info, size: 14, font: font.regular },
            {
                edit: (direction) => {
                    pattern.stepCount = minmax(pattern.stepCount + direction, 1, 64);
                },
            },
        );

        drawSelectableText(
            `Reload`,
            reloadPosition,
            { color: color.info, size: 14, font: font.regular },
            { edit: async () => reloadPattern(pattern.id) },
        );

        patternPreviewNode({ x: 140, y: headerPosition.y + 4 }, { w: config.screen.size.w - 140, h: 40 }, pattern);
    }

    for (let stepIndex = 0; stepIndex < pattern.stepCount; stepIndex++) {
        const voices = pattern.steps[stepIndex];
        const y = margin * 2 + headerSize.h + scrollY + (margin + size.h) * stepIndex;
        if (y < config.screen.size.h + size.h) {
            for (let voice = 0; voice < MAX_VOICES_IN_PATTERN; voice++) {
                const position = {
                    x: margin + (margin + size.w) * (voice % col),
                    y,
                };
                drawStep(pattern, stepIndex, voice, voices[voice], position);
            }
        }
    }
}

function drawStep(pattern: Pattern, stepIndex: number, voice: number, step: Step | null, position: Point) {
    let fontSize = 12;
    let noteFontSize = 16;
    let positionNote = { x: position.x + 2, y: position.y + 1 };
    let positionVelocity = { x: position.x + 38, y: position.y + 1 };
    let positionVelocityInfo = { x: positionVelocity.x + 23, y: positionVelocity.y };
    let positionTie = { x: position.x + 85, y: position.y + 1 };
    let positionCondition = { x: position.x + 38, y: position.y + 18 };
    if (config.screen.col === 1) {
        noteFontSize = 12;
        positionNote.x = position.x + 1;
        positionVelocity.x = position.x + 29;
        positionVelocityInfo.x = positionVelocity.x + 21;
        positionTie = { x: position.x + 1, y: position.y + 18 };
        positionCondition.x = position.x + 22;
    }

    if (position.y < -size.h) {
        // Not visible no need to draw
        pushSelectableItem(positionNote);
        pushSelectableItem(positionVelocity);
        pushSelectableItem(positionTie);
        pushSelectableItem(positionCondition);
    } else {
        setColor(color.foreground);
        drawFilledRect({ position, size });

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

        drawSelectableText(
            stepStr.note,
            positionNote,
            { color: color.info, size: noteFontSize, font: font.bold },
            {
                edit: (direction) => {
                    if (step) {
                        if (direction < 0 && step.note <= NOTE_START) {
                            pattern.steps[stepIndex][voice] = null;
                        } else {
                            step.note = minmax(step.note + direction, NOTE_START, NOTE_END);
                        }
                    } else if (direction === 1) {
                        // If no already existing step, create one if direction is positive
                        const previousStep = pattern.steps
                            .slice(0, stepIndex)
                            .reverse()
                            .find((step) => step[voice]?.note)?.[voice];
                        pattern.steps[stepIndex][voice] = {
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
            positionVelocity,
            { color: color.info, size: fontSize, font: font.regular },
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
            drawText('%', positionVelocityInfo, { color: color.secondaryInfo, size: fontSize - 2, font: font.regular });
        }

        drawSelectableText(
            stepStr.tie,
            positionTie,
            { color: color.info, size: fontSize, font: font.regular },
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
            positionCondition,
            { color: color.secondaryInfo, size: fontSize, font: font.regular },
            {
                edit: (direction) => {
                    if (step) {
                        step.condition = minmax((step?.condition || 0) + direction, 0, STEP_CONDITIONS.length - 1);
                    }
                },
            },
        );
    }
}

const srollingStep = 40;
export async function patternEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await patternView();
        return true;
    }
    if (editMode.edit) {
        const updated = await eventEdit(events);
        if (updated) {
            await patternView();
            return true;
        }
        return false;
    } else {
        const item = eventSelector(events, findByColumnFirst);
        if (item) {
            if (item.position.y > config.screen.size.h - srollingStep) {
                scrollY -= srollingStep;
            } else if (item.position.y < srollingStep && scrollY < 0) {
                scrollY += srollingStep;
            }
            await patternView();
            return true;
        }
    }
    return false;
}
