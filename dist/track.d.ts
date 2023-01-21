import { Color } from 'zic_node_ui';
export interface Track {
    id: number;
    name: string;
    engine: string;
    color?: Color;
}
export declare const getTracks: () => Track[];
export declare const getTrack: (id: number) => Track;
export declare const getTrackCount: () => number;
export declare const getTrackColor: (id: number) => Color;
export declare function loadTracks(): Promise<void>;
//# sourceMappingURL=track.d.ts.map