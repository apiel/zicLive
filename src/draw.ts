import { Color, drawRect, drawText, Point, Rect, setColor, TextOptions } from 'zic_node_ui';
import { EditHandler, pushSelectableItem } from './selector';
import { color } from './style';

export function drawSelectableRect(
    rect: Rect,
    rectColor: Color,
    edit: EditHandler = () => {},
    steps?: [number, number],
) {
    if (pushSelectableItem(rect.position, edit, steps)) {
        setColor(rectColor);
        drawRect(rect);
    }
}


export function drawSelectableText(
    text: string,
    position: Point,
    options: TextOptions,
    edit: EditHandler = () => {},
    steps?: [number, number],
) {
    const rect = drawText(text, position, options);
    drawSelectableRect({
        position: { x: rect.position.x - 2, y: rect.position.y - 2 },
        size: { w: rect.size.w + 4, h: rect.size.h + 3 },
    }, color.secondarySelected, edit, steps);
}
