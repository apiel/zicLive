"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirectory = exports.fileExist = exports.truncate = exports.minmax = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const minmax = (value, min, max) => Math.min(Math.max(value, min), max);
exports.minmax = minmax;
const truncate = (str, length) => (str.length > length ? `${str.substring(0, length)}...` : str);
exports.truncate = truncate;
const fileExist = (file) => (0, promises_1.access)(file, fs_1.constants.F_OK)
    .then(() => true)
    .catch(() => false);
exports.fileExist = fileExist;
const isDirectory = async (path) => (await (0, promises_1.lstat)(path)).isDirectory();
exports.isDirectory = isDirectory;
