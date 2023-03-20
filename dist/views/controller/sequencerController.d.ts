import { MidiMsg } from '../../midi';
export declare const padSeq: number[];
export declare const padBanks: number[];
export declare function sequencerController(): void;
export declare function sequenceSelectMidiHandler(midiMsg: MidiMsg, viewPadPressed: boolean): boolean;
export declare function sequenceToggleMidiHandler({ isController, message: [type, padKey] }: MidiMsg): Promise<boolean>;
//# sourceMappingURL=sequencerController.d.ts.map