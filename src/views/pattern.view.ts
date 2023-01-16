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

const margin = 1;
const col = 4;
const headerSize = { w: config.screen.size.w - margin * 2, h: 49 };
const size = { w: config.screen.size.w / col - margin, h: 35 };

let selectableItems: Point[] = [];
let selectedItem = 0;

function drawSelectableText(text: string, position: Point, options: TextOptions) {
    const rect = drawText(text, position, options);
    const pos = selectableItems.push(rect.position);
    if (pos - 1 === selectedItem) {
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
    selectableItems = [];

    clear(color.background);

    setColor(color.foreground);
    const headerPosition = { x: margin, y: margin };
    drawFilledRect({ position: headerPosition, size: headerSize });

    drawSelectableText(
        `ID: ${idStr}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 4 },
        { color: color.primary, size: 14, font: font.bold },
    );

    drawSelectableText(
        `Len: ${pattern.stepCount}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 24 },
        { color: color.info, size: 14, font: font.regular },
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
                );

                drawSelectableText(
                    `${step.velocity}%`,
                    { x: position.x + 35, y: position.y + 1 },
                    { color: color.info, size: 12, font: font.regular },
                );

                if (step.tie) {
                    drawSelectableText(
                        `Tie`,
                        { x: position.x + 82, y: position.y + 1 },
                        { color: color.info, size: 12, font: font.regular },
                    );
                }

                const condition = step.condition
                    ? STEP_CONDITIONS[step.condition]
                    : STEP_CONDITIONS[0];
                drawSelectableText(
                    condition,
                    { x: position.x + 35, y: position.y + 18 },
                    { color: color.secondaryInfo, size: 12, font: font.regular },
                );
            }
        }
    }
}

const KEY_UP = 82;
const KEY_DOWN = 81;
const KEY_LEFT = 80;
const KEY_RIGHT = 79;

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

function findNextSelectableItem(direction: Direction) {
    const current = selectableItems[selectedItem];
    let next: Point | undefined;
    let nextIndex = -1;
    if (direction === Direction.UP) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.x === current.x && item.y < current.y && (!next || item.y > next.y)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    } else if (direction === Direction.DOWN) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.x === current.x && item.y > current.y && (!next || item.y < next.y)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    } else if (direction === Direction.LEFT) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.y === current.y && item.x < current.x && (!next || item.x > next.x)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    } else if (direction === Direction.RIGHT) {
        for (let index in selectableItems) {
            const item = selectableItems[index];
            if (item.y === current.y && item.x > current.x && (!next || item.x < next.x)) {
                next = item;
                nextIndex = parseInt(index);
            }
        }
    }
    if (next) {
        selectedItem = nextIndex;
    } else {
        if (direction === Direction.UP) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (item.y < current.y && (!next || item.y > next.y)) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        } else if (direction === Direction.DOWN) {
            for (let index in selectableItems) {
                const item = selectableItems[index];
                if (item.y > current.y && (!next || item.y < next.y)) {
                    next = item;
                    nextIndex = parseInt(index);
                }
            }
        }
        // else if (direction === Direction.LEFT) {
        //     for (let index in selectableItems) {
        //         const item = selectableItems[index];
        //         if (item.x < current.x && (!next || item.x > next.x)) {
        //             next = item;
        //             nextIndex = parseInt(index);
        //         }
        //     }
        // } else if (direction === Direction.RIGHT) {
        //     for (let index in selectableItems) {
        //         const item = selectableItems[index];
        //         if (item.x > current.x && (!next || item.x < next.x)) {
        //             next = item;
        //             nextIndex = parseInt(index);
        //         }
        //     }
        // }
    }
    if (next) {
        selectedItem = nextIndex;
    }
}

export async function patternUpdate(events: Events) {
    if (events.keysDown) {
        if (events.keysDown.includes(KEY_UP)) {
            findNextSelectableItem(Direction.UP);
        }
        if (events.keysDown.includes(KEY_DOWN)) {
            findNextSelectableItem(Direction.DOWN);
        }
        if (events.keysDown.includes(KEY_LEFT)) {
            findNextSelectableItem(Direction.LEFT);
        }
        if (events.keysDown.includes(KEY_RIGHT)) {
            findNextSelectableItem(Direction.RIGHT);
        }
    }
    await partternView(1);
    return true;
}
