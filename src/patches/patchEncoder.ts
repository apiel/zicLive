import { EncoderData } from '../layout/encoders.layout';
import { currentPatchId, getPatch, setCurrentPatchId } from '../patch';

export const patchEncoder: EncoderData = {
    title: 'Patch',
    getValue: () => `#${`${currentPatchId}`.padStart(3, '0')}`,
    handler: async (direction) => {
        setCurrentPatchId(currentPatchId + direction);
        return true;
    },
    unit: () => getPatch(currentPatchId).name,
};
