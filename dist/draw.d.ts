import { Color, Point, Rect, TextOptions } from 'zic_node_ui';
import { EditHandler, SelectableOptions } from './selector';
export declare function drawSelectableRect(rect: Rect, rectColor: Color, options: SelectableOptions): void;
export declare function drawSelectableText(text: string, position: Point, textOptions: TextOptions, selectableOptions: SelectableOptions): void;
export interface FieldOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    info?: string;
    valueColor?: Color;
    scrollY?: number;
}
export declare function drawField(label: string, value: string, row: number, selectableOptions: SelectableOptions, options?: FieldOptions): void;
export interface ButtonOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    scrollY?: number;
}
export declare function drawButton(text: string, row: number, edit: EditHandler, options?: ButtonOptions): void;
//# sourceMappingURL=draw.d.ts.map