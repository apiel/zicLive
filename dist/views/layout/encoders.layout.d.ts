import { MidiMsg } from '../../midi';
import { Encoder } from '../../nodes/encoder.node';
import { EncoderCount } from '../../midi/akaiApcKey25';
import { Tuple } from '../../interface';
export interface EncoderData extends Encoder {
    handler: (direction: number) => Promise<boolean>;
    debounce?: number;
}
export type Encoders = Tuple<EncoderData | undefined, EncoderCount>;
export declare function encodersView(encoders: Encoders): Promise<void>;
export declare function encodersHandler(encoders: Encoders, { message: [type, key, value] }: MidiMsg): false | Promise<boolean>;
//# sourceMappingURL=encoders.layout.d.ts.map