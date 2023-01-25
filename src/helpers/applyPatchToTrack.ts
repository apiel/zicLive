import { trackSetNumber, trackSetString } from 'zic_node';
import { getPatch, Patch } from '../patch';
import { getTrack } from '../track';

export function applyPatchIdToTrack(patchId: number, trackId: number) {
    const track = getTrack(patchId);
    const patch = getPatch(track.engine, patchId);
    if (patch) {
        applyPatchToTrack(patch, trackId);
    }
}

export function applyPatchToTrack(patch: Patch, trackId: number) {
    for (const [id, value] of Object.entries(patch.number)) {
        trackSetNumber(trackId, value, parseInt(id));
    }
    for (const [id, value] of Object.entries(patch.str)) {
        trackSetString(trackId, value, parseInt(id));
    }
    // for Cc
}
