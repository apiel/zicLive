import { View } from '../../../def';
import { EncoderData } from '../../../layout/encoders.layout';
import { forceSelectedItem } from '../../../selector';
import { getSelectedSequence, getSelectedSequenceId, sequences, setSelectedSequenceId } from '../../../sequence';
import { getTrackStyle } from '../../../track';
import { minmax } from '../../../util';

export const sequenceEncoder: EncoderData = {
    node: {
        title: 'Sequence',
        getValue: () => {
            const { id, trackId } = getSelectedSequence();
            return {
                value: `#${`${id + 1}`.padStart(3, '0')}`,
                valueColor: trackId === undefined ? undefined : getTrackStyle(trackId).color,
            };
        },
    },
    handler: async (direction) => {
        const id = minmax(getSelectedSequenceId() + direction, 0, sequences.length - 1);
        setSelectedSequenceId(id);
        forceSelectedItem(View.Sequencer, id);
        return true;
    },
};
