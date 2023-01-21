import { Color, Point, Rect, Size } from 'zic_node_ui';
import { Pattern } from '../pattern';
export declare function sequencePosition(id: number, size: Size, col: number, scrollY?: number): Point;
export declare function sequenceRect(id: number, col: number, scrollY?: number): Rect;
interface Props {
    titleColor: Color;
    title: string;
    playing: boolean;
    detune: number;
    next?: string;
    repeat: number;
    pattern: Pattern;
    activeStep?: number;
}
export declare function sequenceNode(id: number, col: number, { titleColor, title, playing, detune, next, repeat, pattern, activeStep }: Props, scrollY?: number): Rect;
export {};
//# sourceMappingURL=sequence.node.d.ts.map