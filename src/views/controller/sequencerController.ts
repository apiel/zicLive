import { sendMidiMessage } from 'zic_node';
import { MidiMsg, midiOutController, MIDI_TYPE } from '../../midi';
import { akaiApcKey25 } from '../../midi/akaiApcKey25';
import { getSequence, sequences, setSelectedSequenceId, toggleSequence } from '../../sequence';
import { getTrackStyle } from '../../track';
import { sequencerView } from '../sequencer.view';

// prettier-ignore
export const padSeq = [
    0x20, 0x21, 0x22, 0x23, 0x24, 0x25,
    0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,
    0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05,
];

// prettier-ignore
export const padBanks = [
    0x26, 0x27,
    0x1e, 0x1f, 
    0x16, 0x17,
    0x0e, 0x0f,
    0x06, 0x07,
];

export function sequencerController() {
    if (midiOutController?.port) {
        for (let i = 0; i < 30; i++) {
            const { trackId, playing } = sequences[i];
            if (trackId !== undefined) {
                const { padColor } = getTrackStyle(trackId);
                // TODO if pad seq still playing but will end, then it should be blink quickly
                // if pad will start to play next, then it should be blink/pulse slowly?
                const padMode = playing ? akaiApcKey25.padMode.pulsing1_4 : akaiApcKey25.padMode.on100pct;
                sendMidiMessage(midiOutController.port, [padMode, padSeq[i], padColor]);
            } else {
                sendMidiMessage(midiOutController.port, [akaiApcKey25.padMode.on100pct, padSeq[i], 0x00]);
            }
        }

        // TODO
        // FIXME
        padBanks.forEach((pad, i) => {
            sendMidiMessage(midiOutController!.port, [akaiApcKey25.padMode.on100pct, pad, 0x00]);
        });
    }
}

export function sequenceSelectMidiHandler(midiMsg: MidiMsg, viewPadPressed: boolean) {
    if (viewPadPressed && midiMsg.isController) {
        const [type, padKey] = midiMsg.message;
        if (type === MIDI_TYPE.KEY_RELEASED) {
            const seqId = padSeq.indexOf(padKey);
            if (seqId !== -1) {
                setSelectedSequenceId(seqId);
                return true;
            }
        }
    }
    return false;
}

export async function sequenceToggleMidiHandler({ isController, message: [type, padKey] }: MidiMsg) {
    if (isController && type === MIDI_TYPE.KEY_RELEASED) {
        const seqId = padSeq.indexOf(padKey);
        if (seqId !== -1) {
            const sequence = getSequence(seqId);
            if (sequence) {
                toggleSequence(sequence);
                await sequencerView({ controllerRendering: true });
                return true;
            }
        }
    }
    return false;
}
