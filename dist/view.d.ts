import { Events } from 'zic_node_ui';
import { View } from './def';
export declare const getView: () => View;
export declare const setView: (newView: View) => boolean;
export interface RenderOptions {
    beatRendering?: boolean;
}
export declare const renderView: (options?: RenderOptions) => Promise<void>;
export declare const viewEventHandler: (events: Events) => Promise<boolean | undefined>;
//# sourceMappingURL=view.d.ts.map