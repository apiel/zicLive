import { RenderOptions } from '../view';
import { MidiMsg } from '../midi';
import { EncoderData } from './layout/encoders.layout';
export declare const sequenceEncoder: EncoderData;
export declare function sequencerEditView({ controllerRendering }?: RenderOptions): Promise<void>;
export declare function sequencerEditMidiHandler(midiMsg: MidiMsg, viewPadPressed: boolean): Promise<boolean>;
//# sourceMappingURL=sequencerEdit.view.d.ts.map