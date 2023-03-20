import { Color } from 'zic_node_ui';
export interface EncoderValue {
    value: string;
    valueColor?: Color;
}
export interface Encoder {
    title: string;
    getValue: () => EncoderValue | string;
    unit?: string | (() => string);
}
export declare function encoderNode(index: number, encoder: Encoder | undefined): void;
//# sourceMappingURL=encoder.node.d.ts.map