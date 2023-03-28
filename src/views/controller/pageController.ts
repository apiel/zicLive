import { MidiMsg, MIDI_TYPE } from '../../midi';
import { akaiApcKey25 } from '../../midi/akaiApcKey25';

export function pageMidiHandler({ isController, message: [type, padKey] }: MidiMsg, changePage: (direction: number) => void) {
    if (isController) {
        switch (padKey) {
            case akaiApcKey25.pad.down: {
                if (type === MIDI_TYPE.KEY_RELEASED) {
                    changePage(+1);
                    return true;
                }
                return false;
            }
            case akaiApcKey25.pad.up: {
                if (type === MIDI_TYPE.KEY_RELEASED) {
                    changePage(-1);
                    return true;
                }
                return false;
            }
        }
    }
    return false;
}
