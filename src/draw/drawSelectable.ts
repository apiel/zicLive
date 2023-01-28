import { Color, drawRect, drawText, Point, Rect, setColor, TextOptions } from 'zic_node_ui';
import { pushSelectableItem, SelectableOptions } from '../selector';
import { color } from '../style';

export function drawSelectableRect(rect: Rect, rectColor: Color, options: SelectableOptions) {
    if (pushSelectableItem(rect.position, options)) {
        setColor(rectColor);
        drawRect(rect);
    }
}

export function drawSelectableText(
    text: string,
    position: Point,
    textOptions: TextOptions,
    selectableOptions: SelectableOptions,
) {
    const rect = drawText(text, position, textOptions);
    drawSelectableRect(
        {
            position: { x: rect.position.x - 2, y: rect.position.y - 2 },
            size: { w: rect.size.w + 4, h: rect.size.h + 3 },
        },
        color.secondarySelected,
        selectableOptions,
    );
    return rect;
}