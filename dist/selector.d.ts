import { Point } from 'zic_node_ui';
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
}
export interface SelectableItem {
    position: Point;
    options?: SelectableOptions;
}
export declare function getSlectedItem(): SelectableItem;
export declare function pushSelectableItem(position: Point, options?: SelectableOptions): boolean;
export declare function cleanSelectableItems(): void;
export declare function findNextSelectableItem(direction: Direction, findCloseFromSameColumn?: boolean): SelectableItem;
//# sourceMappingURL=selector.d.ts.map