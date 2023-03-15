import { Rect } from 'zic_node_ui';
import { SequenceNoteOptions } from './sequences.node';
import { SelectableOptions } from '../selector';
export declare const height: number;
export declare function sequenceRect(id: number, scrollY?: number): Rect;
export declare function sequencesRowNode(scrollY: number, getSelectableOptions: ((id: number) => SelectableOptions) | undefined, _sequences: import("../sequence").Sequence[] | undefined, options: SequenceNoteOptions): void;
//# sourceMappingURL=sequencesRow.node.d.ts.map