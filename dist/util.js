export const minmax = (value, min, max) => Math.min(Math.max(value, min), max);
export const truncate = (str, length) => str.length > length ? `${str.substring(0, length)}...` : str;
