export declare function getColPosition(col: number): number;
export interface DrawOptions {
    row?: number;
    scrollY?: number;
    col?: 1 | 2;
}
export declare function getDrawRect({ row, scrollY, col }: DrawOptions): {
    position: {
        x: number;
        y: number;
    };
    size: {
        w: number;
        h: number;
    };
};
//# sourceMappingURL=getDrawRect.d.ts.map