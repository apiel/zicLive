import { Point } from 'zic_node_ui';
import { View } from './def';
export declare enum Direction {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3
}
export type EditHandler = (direction: number) => Promise<any> | any;
export interface SelectableOptions {
    onSelected?: () => void;
    edit?: EditHandler;
    steps?: [number, number];
    priority?: boolean;
}
export interface SelectableItem {
    position: Point;
    options?: SelectableOptions;
}
export declare function getSlectedItem(): SelectableItem;
export declare function getSelectedIndex(): number;
export declare function forceSelectedItem(view: View, index: number): void;
export declare function pushSelectableItem(position: Point, options?: SelectableOptions): boolean;
export declare function cleanSelectableItems(): void;
/**
 *
 * @param direction
 * @returns
 */
export declare function findNextSelectableItem(direction: Direction, findByColumnFirst?: boolean): SelectableItem;
//# sourceMappingURL=selector.d.ts.map