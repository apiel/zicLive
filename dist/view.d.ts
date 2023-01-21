import { Events } from 'zic_node_ui';
export declare enum View {
    Sequencer = 0,
    SequencerEdit = 1,
    Pattern = 2,
    Preset = 3,
    Master = 4,
    Project = 5,
    Help = 6
}
export declare const getView: () => View;
export declare const setView: (newView: View) => boolean;
export declare const renderView: () => Promise<void>;
export declare const viewEventHandler: (events: Events) => true | Promise<boolean>;
//# sourceMappingURL=view.d.ts.map