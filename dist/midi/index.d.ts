import { MidiMessage } from 'zic_node';
export interface MidiMsg extends MidiMessage {
    isController?: boolean;
    isKeyboard?: boolean;
}
export declare function handleMidi(data: MidiMsg): Promise<void>;
//# sourceMappingURL=index.d.ts.map