import { sendMidiMessage } from 'zic_node';
import { midiOutController } from '../../midi';
import { akaiApcKey25 } from '../../midi/akaiApcKey25';

// prettier-ignore
export const padBanks = [
    0x26, 0x27,
    0x1e, 0x1f, 
    0x16, 0x17,
    0x0e, 0x0f,
    0x06, 0x07,
];

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
