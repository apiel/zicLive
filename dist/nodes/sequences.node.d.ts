import { Rect } from 'zic_node_ui';
import { Sequence } from '../sequence';
import { SelectableOptions } from '../selector';
export interface SequenceNoteOptions {
    selectedId?: number;
}
export declare function sequencesNode(sequences: Sequence[], scrollY: number, sequenceRect: (id: number, scrollY: number) => Rect, getSelectableOptions?: (id: number) => SelectableOptions, { selectedId }?: SequenceNoteOptions): void;
//# sourceMappingURL=sequences.node.d.ts.map