import { Color } from 'zic_node_ui';
import { color } from './style';

export interface Track {
    id: number;
    color: Color;
}

export const tracks: Track[] = [
    { id: 0, color: color.tracks[0] },
    { id: 1, color: color.tracks[1] },
    { id: 2, color: color.tracks[2] },
    { id: 3, color: color.tracks[3] },
    { id: 4, color: color.tracks[4] },
    { id: 5, color: color.tracks[5] },
    { id: 6, color: color.tracks[6] },
    { id: 7, color: color.tracks[7] },
];

export const getTrackColor = (id: number) => tracks[id].color;
