import { drawFilledRect, drawRect, drawText, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { getSelectedSequenceId, sequences } from '../sequence';
import { color, font, unit } from '../style';
import { getTrackStyle } from '../track';

const { margin } = unit;

const sequenceRect = (id: number): Rect => {
    const size = { w: 25, h: 15 };
    return {
        position: {
            x: margin + (margin + size.w) * (id % config.sequence.col),
            y: margin + (margin + size.h) * Math.floor(id / config.sequence.col),
        },
        size,
    };
};

export function sequenceMiniGridSelection() {
    for (let i = 0; i < 30; i++) {
        const rect = sequenceRect(i);
        const { trackId } = sequences[i];
        setColor(trackId !== undefined ? getTrackStyle(trackId).color : color.foreground);
        drawFilledRect(rect);
        const isSelected = getSelectedSequenceId() === i;
        drawText(
            `${i + 1}`.padStart(3, '0'),
            { x: rect.position.x + 4, y: rect.position.y + 1 },
            { color: color.foreground3, size: 10, font: font.regular },
        );
        if (isSelected) {
            // TODO find better selection color
            setColor(color.white);
            drawRect(rect);
        }
    }
}
