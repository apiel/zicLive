import { readFile } from 'fs/promises';
import { drawFilledRect, drawText, setColor } from 'zic_node_ui';
import { Midi } from 'tonal';
import { patternPreview } from '../components/patternPreview';
import { config } from '../config';
import { defaultPattern, MAX_VOICES } from '../pattern';
import { color, font } from '../style';

const margin = 1;
const col = 4;
const headerSize = { w: config.screen.size.w - margin * 2, h: 49 };
const size = { w: config.screen.size.w / col - margin, h: 35 };

export async function partternView(id: number) {
    const idStr = id.toString().padStart(3, '0');

    let pattern = defaultPattern(id);
    try {
        const content = await readFile(`${config.path.patterns}/${idStr}.json`, 'utf8');
        pattern = JSON.parse(content.toString());
    } catch (error) {}

    setColor(color.foreground);
    const headerPosition = { x: margin, y: margin };
    drawFilledRect({ position: headerPosition, size: headerSize });

    drawText(
        `ID: ${idStr}`,
        { x: headerPosition.x + 5, y: headerPosition.y + 4 },
        { color: color.primary, size: 14, font: font.bold },
    );

    drawText(
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
                drawText(
                    `${Midi.midiToNoteName(step.note, { sharps: true })}`,
                    { x: position.x + 2, y: position.y + 1 },
                    { color: color.info, size: 14, font: font.bold },
                );

                drawText(
                    `${step.velocity}%`,
                    { x: position.x + 35, y: position.y + 1 },
                    { color: color.info, size: 12, font: font.regular },
                );

                if (step.tie) {
                    drawText(
                        `Tie`,
                        { x: position.x + 82, y: position.y + 1 },
                        { color: color.info, size: 12, font: font.regular },
                    );
                }
            }
        }
    }
}
