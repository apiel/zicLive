import { Color } from 'zic_node_ui';
import { color } from './style';

export interface Track {
    id: number;
    name: string;
    color: Color;
}

export const tracks: Track[] = [
    { id: 0, name: 'Synth', color: color.tracks[0] },
    { id: 1, name: 'Synth', color: color.tracks[1] },
    { id: 2, name: 'Synth', color: color.tracks[2] },
    { id: 3, name: 'PD', color: color.tracks[3] },
    { id: 4, name: 'Midi', color: color.tracks[4] },
    { id: 5, name: 'Midi', color: color.tracks[5] },
    { id: 6, name: 'Midi', color: color.tracks[6] },
    { id: 7, name: 'Midi', color: color.tracks[7] },
];

export const getTrackColor = (id: number) => tracks[id].color;
