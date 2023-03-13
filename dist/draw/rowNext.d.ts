export declare const rowNext: (_col: number) => number;
/**
 * Add a number to the row counter and return it
 * @param add
 * @returns
 */
export declare const rowAdd: (add: number) => number;
/**
 * Make a copy of the current row counter, add a number to it and return the orignal copy.
 * So we return the value before the addition was done.
 *
 * @param add
 * @returns
 */
export declare const rowGetAndAdd: (add: number) => number;
export declare const rowReset: (_row?: number) => void;
export declare const rowGet: () => number;
//# sourceMappingURL=rowNext.d.ts.map