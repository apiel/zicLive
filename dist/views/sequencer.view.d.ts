import { RenderOptions } from '../view';
import { MidiMsg } from '../midi';
export declare function sequencerView({ controllerRendering }?: RenderOptions): Promise<void>;
export declare function sequencerMidiHandler({ isController, message: [type, padKey] }: MidiMsg): Promise<boolean>;
//# sourceMappingURL=sequencer.view.d.ts.map