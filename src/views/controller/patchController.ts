import { sendMidiMessage } from 'zic_node';
import { MidiMsg, midiOutController, MIDI_TYPE } from '../../midi';
import { akaiApcKey25 } from '../../midi/akaiApcKey25';
import { getPatchView } from '../patch.view';
import { padBanks } from './sequencerController';

export function patchController(count = 0, active = 0) {
    if (midiOutController?.port) {
        padBanks.forEach((pad, i) => {
            sendMidiMessage(midiOutController!.port, [
                i === active ? akaiApcKey25.padMode.on100pct : akaiApcKey25.padMode.on10pct,
                pad,
                i < count ? 0x03 : 0x00,
            ]);
        });
    }
}

export function patchPadMidiHandler({ isController, message: [type, padKey] }: MidiMsg) {
    if (isController) {
        if (type === MIDI_TYPE.KEY_RELEASED) {
            const index = padBanks.findIndex((p) => p === padKey);
            if (index !== -1) {
                console.log('set patch view', index);
                getPatchView()?.setView(index);
                return true;
            }
        }
    }
    return false;
}
