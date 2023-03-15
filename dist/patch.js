"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePatchAs = exports.loadPatches = exports.getPatch = exports.patches = exports.Patch = exports.setCurrentPatchId = exports.currentPatchId = void 0;
const promises_1 = require("fs/promises");
const zic_node_1 = require("zic_node");
const config_1 = require("./config");
const sequence_1 = require("./sequence");
const util_1 = require("./util");
exports.currentPatchId = 0;
function setCurrentPatchId(id) {
    exports.currentPatchId = (0, util_1.minmax)(0, zic_node_1.PATCH_COUNT - 1, id);
}
exports.setCurrentPatchId = setCurrentPatchId;
const sortedEngine = Object.values(config_1.config.engines)
    .sort((a, b) => a.idStart - b.idStart)
    .reverse();
function getEngineByPatchId(patchId) {
    const engine = sortedEngine.find((engine) => patchId >= engine.idStart);
    if (!engine) {
        throw new Error(`No engine found for patch ${patchId}`);
    }
    return engine;
}
class Patch {
    setString(stringId, value) {
        this.isModified = true;
        this.strings[stringId] = value;
        const sequences = (0, sequence_1.getPlayingSequencesForPatch)(this.id);
        for (const sequence of sequences) {
            (0, zic_node_1.trackSetString)(sequence.trackId, value, stringId);
        }
    }
    setNumber(floatId, value) {
        this.isModified = true;
        this.floats[floatId] = value;
        const sequences = (0, sequence_1.getPlayingSequencesForPatch)(this.id);
        for (const sequence of sequences) {
            (0, zic_node_1.trackSetNumber)(sequence.trackId, value, floatId);
        }
    }
    setCc(ccId, value) {
        this.isModified = true;
        this.cc[ccId] = value;
        const sequences = (0, sequence_1.getPlayingSequencesForPatch)(this.id);
        for (const sequence of sequences) {
            (0, zic_node_1.trackCc)(sequence.trackId, value, ccId);
        }
    }
    constructor(id) {
        this.id = id;
        this.isModified = false;
        this.name = 'Init patch';
        this.floats = {};
        this.strings = {};
        this.cc = {};
        this.engine = getEngineByPatchId(this.id);
        this.filename = `${(this.id - this.engine.idStart).toString().padStart(3, '0')}.json`;
    }
    save() {
        const engine = getEngineByPatchId(this.id);
        const patchFile = `${engine.path}/${this.filename}`;
        return (0, promises_1.writeFile)(patchFile, JSON.stringify(this, null, 2));
    }
    async load() {
        const patchFile = `${this.engine.path}/${this.filename}`;
        if (!(await (0, util_1.fileExist)(patchFile))) {
            this.isModified = false;
            this.name = this.engine.initName;
            // TODO might want to assign default patch
            return;
        }
        const patch = JSON.parse((await (0, promises_1.readFile)(patchFile)).toString());
        patch.id += this.engine.idStart;
        this.isModified = true;
        Object.assign(this, patch);
        (0, zic_node_1.setPatch)(patch);
    }
    set({ id, ...patch }) {
        Object.assign(this, patch);
        (0, zic_node_1.setPatch)(this);
        this.isModified = true;
    }
}
exports.Patch = Patch;
exports.patches = Array(zic_node_1.PATCH_COUNT)
    .fill(undefined)
    .map((_, id) => new Patch(id));
const getPatch = (patchId) => {
    const id = (0, util_1.minmax)(patchId, 0, exports.patches.length - 1);
    return exports.patches[id];
};
exports.getPatch = getPatch;
async function loadPatches() {
    try {
        for (const patch of exports.patches) {
            await patch.load();
        }
    }
    catch (error) {
        console.error(`Error while loading patche engines`, error);
    }
}
exports.loadPatches = loadPatches;
async function savePatchAs(patch, as) {
    const isUnique = exports.patches.every((p) => p.name !== as);
    if (!isUnique) {
        throw new Error(`Patch name ${as} is not unique`);
    }
    let nextId = exports.patches.findIndex((p) => p.isModified === false);
    if (nextId === -1) {
        throw new Error(`No more free patch`);
    }
    exports.patches[nextId].set({ ...patch, name: as });
    await exports.patches[nextId].save();
}
exports.savePatchAs = savePatchAs;
