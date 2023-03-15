import { Events } from 'zic_node_ui';
import { SelectableItem } from './selector';
export declare const KEY_UP = 82;
export declare const KEY_DOWN = 81;
export declare const KEY_LEFT = 80;
export declare const KEY_RIGHT = 79;
export declare const KEY_MENU = 4;
export declare const KEY_EDIT = 22;
export declare function isEventUpPressed(events: Events): boolean | undefined;
export declare function isEventDownPressed(events: Events): boolean | undefined;
export declare function isEventLeftPressed(events: Events): boolean | undefined;
export declare function isEventRightPressed(events: Events): boolean | undefined;
export declare function isEventMenuPressed(events: Events): boolean | undefined;
export declare function isEventEditPressed(events: Events): boolean | undefined;
export declare function isEventEditRelease(events: Events): boolean | undefined;
export declare function eventSelector(events: Events, findCloseFromSameColumn?: boolean): SelectableItem | undefined;
export declare function eventMenu(events: Events): boolean;
export declare function eventEdit(events: Events): Promise<boolean>;
export declare function getEditMode(events: Events): Promise<{
    edit: boolean;
    refreshScreen: boolean;
}>;
//# sourceMappingURL=events.d.ts.map