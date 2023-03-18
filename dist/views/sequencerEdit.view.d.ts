import { RenderOptions } from '../view';
import { MidiMsg } from '../midi';
export declare function sequencerEditView({ controllerRendering }?: RenderOptions): Promise<void>;
export declare function sequencerEditMidiHandler({ isController, message: [type, padKey] }: MidiMsg): Promise<boolean>;
//# sourceMappingURL=sequencerEdit.view.d.ts.map