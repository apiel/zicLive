import { Color } from 'zic_node_ui';
import { EngineType } from './config';
export interface Track {
    id: number;
    name: string;
    engine: EngineType;
}
export declare const getTracks: () => Track[];
export declare const getTrack: (id: number) => Track;
export declare const getTrackCount: () => number;
export declare const getTrackStyle: (id: number) => {
    color: Color;
    padColor: number;
};
export declare function loadTracks(): Promise<void>;
//# sourceMappingURL=track.d.ts.map