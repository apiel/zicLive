import { SelectableOptions } from '../selector';
import { FieldOptions } from './drawField';
export interface SliderOptions extends Omit<FieldOptions, 'info'> {
    leftLabel?: string;
    rightLabel?: string;
    width?: number;
}
export declare function drawSliderField(label: string, value: number, row: number, selectableOptions: SelectableOptions, options?: SliderOptions): void;
//# sourceMappingURL=drawSlider.d.ts.map