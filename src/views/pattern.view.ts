import { readFile } from 'fs/promises';
import { drawFilledRect, drawText, setColor } from 'zic_node_ui';
import { patternPreview } from '../components/patternPreview';
import { config } from '../config';
import { defaultPattern } from '../pattern';
import { color, font } from '../style';

const windowPadding = 1;
const margin = 1;
const col = 4;
const headerSize = { w: config.screen.size.w - margin * 2, h: 49 };

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
}
