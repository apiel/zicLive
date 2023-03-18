import { Color } from 'zic_node_ui';
export interface Encoder {
    title: string;
    value: string;
    valueColor?: Color;
}
export type Encoders = [
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null,
    Encoder | null
];
export declare function encoderNode(encoders: Encoders): void;
//# sourceMappingURL=encoder.node.d.ts.map