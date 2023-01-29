import { unit } from '../style';

export function getColPosition(col: number) {
    return unit.halfScreen * (col - 1);
}

export interface DrawOptions {
    row?: number;
    scrollY?: number;
    col?: 1 | 2;
}

export function getDrawRect({ row = 0, scrollY = 0, col = 1 }: DrawOptions) {
    const rowHeight = 3;
    return {
        position: {
            x: unit.margin + getColPosition(col),
            y: scrollY + unit.margin + row * unit.height + unit.extraMargin,
        },
        size: {
            w: unit.halfScreen - unit.margin * 2 - unit.extraMargin * 2,
            h: unit.height * rowHeight - unit.margin * rowHeight - unit.extraMargin * 2,
        },
    };
}
