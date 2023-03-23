import { EncoderData } from '../layout/encoders.layout';
import { shiftPressed } from '../midi';
import { currentPatchId, getPatch, setCurrentPatchId } from '../patch';
import { minmax } from '../util';

export const patchEncoder: EncoderData = {
    title: 'Patch',
    getValue: () => `#${`${currentPatchId}`.padStart(3, '0')}`,
    handler: async (direction) => {
        setCurrentPatchId(currentPatchId + direction);
        return true;
    },
    unit: () => getPatch(currentPatchId).name,
};

export const volumeEncoder = (fId: number): EncoderData => ({
    title: 'Volume',
    getValue: () => {
        const patch = getPatch(currentPatchId);
        return Math.round(patch.floats[fId] * 100).toString();
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 0.1 : 0.01), 0, 1));
        return true;
    },
    unit: '%',
});


export const filterCutoffEncoder = (fId: number): EncoderData => ({
    title: 'Filter Cutoff',
    getValue: () => getPatch(currentPatchId).floats[fId].toString(),
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 100 : 10), 200, 8000));
        return true;
    },
    unit: 'hz',
});

export const filterResonanceEncoder = (fId: number): EncoderData => ({
    title: 'Filter Resonance',
    getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId] * 100)}`,
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * 0.01, 0, 1));
        return true;
    },
    unit: '%',
});
