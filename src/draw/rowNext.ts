import { config } from "../config";

let row = 0;
export const rowNext = config.screen.col === 1 ? (_col: number) => row++ : (col: number) => {
    if (col === config.screen.col) {
        row++;
    }
    return row;
};

export const rowReset = () => {
    row = 0;
}
