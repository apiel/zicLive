import { MidiMessage } from 'zic_node';
export declare enum MIDI_TYPE {
    KEY_PRESSED = 144,
    KEY_RELEASED = 128,
    CC = 176
}
export interface MidiMsg extends MidiMessage {
    isController?: boolean;
    isKeyboard?: boolean;
}
export declare const midiOutController: import("zic_node").MidiDeviceInfo | undefined;
export declare let shiftPressed: boolean;
export declare function handleMidi(data: MidiMsg): Promise<void>;
export declare function cleanPadMatrix(): void;
//# sourceMappingURL=index.d.ts.map