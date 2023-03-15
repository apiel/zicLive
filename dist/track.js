"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTracks = exports.getTrackColor = exports.getTrackCount = exports.getTrack = exports.getTracks = void 0;
const promises_1 = require("fs/promises");
const config_1 = require("./config");
const style_1 = require("./style");
let tracks = [];
const getTracks = () => tracks;
exports.getTracks = getTracks;
const getTrack = (id) => tracks[id];
exports.getTrack = getTrack;
const getTrackCount = () => tracks.length;
exports.getTrackCount = getTrackCount;
const getTrackColor = (id) => tracks[id].color || style_1.color.tracks[id % style_1.color.tracks.length];
exports.getTrackColor = getTrackColor;
async function loadTracks() {
    try {
        // Going through track folder is questionable as for the moment 
        // tracks are hardcoded in the app... However, would be great to make track assignement dynamic!
        tracks = JSON.parse((await (0, promises_1.readFile)(config_1.config.path.tracks)).toString());
    }
    catch (error) {
        console.error(`Error while loading tracks`, error);
    }
}
exports.loadTracks = loadTracks;
