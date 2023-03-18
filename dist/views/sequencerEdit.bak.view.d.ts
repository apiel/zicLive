import { Events } from 'zic_node_ui';
import { Engine } from '../config';
import { Step } from '../sequence';
import { RenderOptions } from '../view';
export declare function sequencerEditView(options?: RenderOptions): Promise<void>;
export declare function drawStep(step: Step | null, row: number, stepIndex: number, engine: Engine): void;
export declare function sequencerEditEventHandler(events: Events): Promise<boolean>;
//# sourceMappingURL=sequencerEdit.bak.view.d.ts.map