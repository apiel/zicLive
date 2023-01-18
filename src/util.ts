export const minmax = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export const truncate = (str: string, length: number) =>
    str.length > length ? `${str.substring(0, length)}...` : str;
