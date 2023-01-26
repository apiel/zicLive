import { readdir } from 'fs/promises';
import path from 'path';
import { config } from '../config';
import { minmax } from '../util';

export async function getNextWaveTable(direction: number, currentWaveTable: string) {
    const currentName = path.parse(currentWaveTable).base;
    const names = await readdir(config.path.wavetables);
    const index = names.indexOf(currentName);
    if (index === -1) {
        return names[0];
    }
    const nextIndex = minmax(index + direction, 0, names.length - 1);
    // TODO if direction > 1 get next letter        
    return path.join(config.path.wavetables, names[nextIndex]);
}
