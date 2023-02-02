import { config } from "../config";

// TODO might want  to use: row[col]...

let row = 0;
export const rowNext = config.screen.col === 1 ? (_col: number) => row++ : (col: number) => {
    if (col === config.screen.col) {
        return row++;
    }
    return row;
};

/**
 * Add a number to the row counter and return it
 * @param add 
 * @returns 
 */
export const rowAdd = (add: number) => {
    row += add;
    return row;
}

/**
 * Make a copy of the current row counter, add a number to it and return the orignal copy.
 * So we return the value before the addition was done.
 * 
 * @param add 
 * @returns 
 */
export const rowGetAndAdd = (add: number) => {
    const r = row;
    row += add;
    return r;
}

export const rowReset = () => {
    row = 0;
}

export const rowGet = () => row;
