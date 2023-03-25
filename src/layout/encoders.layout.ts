import { clear } from 'zic_node_ui';
import { color } from '../style';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg, MIDI_TYPE } from '../midi';
import { Encoder, encoderNode } from '../nodes/encoder.node';
import { akaiApcKey25, EncoderCount } from '../midi/akaiApcKey25';
import { Tuple } from '../interface';

const DEFAULT_DEBOUNCE = 200;

export interface EncoderData {
    handler: (direction: number) => Promise<boolean>;
    debounce?: number;
    node: Encoder;
}

export type Encoders = Tuple<EncoderData | undefined, EncoderCount>;

const encoderStates = Object.fromEntries(
    akaiApcKey25.encoderList.map(({ midiKey }, index) => [
        midiKey,
        {
            timing: 0,
            index,
        },
    ]),
);

export async function encodersView(encoders: Encoders) {
    clear(color.background);

    for (let i = 0; i < encoders.length; i++) {
        const encoder = encoders[i];
        encoderNode(i, encoder?.node);
    }

    renderMessage();
}

export function encodersHandler(encoders: Encoders, { message: [type, key, value] }: MidiMsg) {
    if (type === MIDI_TYPE.CC) {
        const state = encoderStates[key];
        if (state) {
            const encoder = encoders[state.index];
            if (encoder?.handler) {
                const { debounce = DEFAULT_DEBOUNCE } = encoder;
                if (encoder.debounce === 0 || Date.now() > state.timing + debounce) {
                    state.timing = Date.now();
                    const direction = value < 63 ? value : -(128 - value);
                    return encoder.handler(direction);
                }
            }
        }
    }
    return false;
}
