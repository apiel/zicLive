import { Events } from 'zic_node_ui';
import { View } from './def';
import { MidiMsg } from './midi';
export declare const getView: () => View;
export declare const setView: (newView: View) => boolean;
export interface RenderOptions {
    beatRendering?: boolean;
    controllerRendering?: boolean;
}
export declare const renderView: (options?: RenderOptions) => Promise<void>;
export declare const viewEventHandler: (events: Events) => Promise<boolean | undefined>;
export declare function viewMidiHandler(midiMsg: MidiMsg): Promise<boolean | undefined>;
//# sourceMappingURL=view.d.ts.map