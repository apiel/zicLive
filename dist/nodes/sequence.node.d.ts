import { Color, Rect } from 'zic_node_ui';
import { Steps } from '../sequence';
interface Props {
    headerColor: Color;
    playing: boolean;
    detune: number;
    next?: string;
    repeat: number;
    stepCount: number;
    steps: Steps;
    activeStep?: number;
    selected?: boolean;
}
export declare function sequenceNode(id: number, { position, size }: Rect, { headerColor, playing, detune, next, repeat, stepCount, steps, activeStep, selected }: Props): Rect;
export {};
//# sourceMappingURL=sequence.node.d.ts.map