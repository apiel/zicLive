import { Color } from 'zic_node_ui';
import { SelectableOptions } from '../selector';
export interface FieldOptions {
    col?: 1 | 2;
    size?: 1 | 2;
    info?: string;
    valueColor?: Color;
    scrollY?: number;
}
export declare function getFieldRect(row: number, options: FieldOptions): {
    position: {
        x: number;
        y: number;
    };
    size: {
        w: number;
        h: number;
    };
};
export declare function drawField(label: string, value: string, row: number, selectableOptions: SelectableOptions, options?: FieldOptions): void;
interface FieldDualOptions extends FieldOptions {
    info2?: string;
    valueColor2?: Color;
}
export declare function drawFieldDual(label: string, value1: string, value2: string, row: number, selectableOptions1: SelectableOptions, selectableOptions2: SelectableOptions, options?: FieldDualOptions): void;
export {};
//# sourceMappingURL=drawField.d.ts.map