import path from 'path';
import { getWavetable, ZicSynth, Wavetable, FilterNames, FilterMode } from 'zic_node';
import { getNextWaveTable } from '../helpers/getNextWavetable';
import { loadPatchId, Patch, savePatch, savePatchAs } from '../patch';
import { minmax } from '../util';
import { config } from '../config';
import { drawWavetable } from '../draw/drawWavetable';
import { drawField, drawFieldDual } from '../draw/drawField';
import { drawEnvelope } from '../draw/drawEnvelope';
import { drawKeyboard } from '../draw/drawKeyboard';
import { withInfo, withSuccess } from '../draw/drawMessage';
import { rowGetAndAdd, rowGet, rowNext, rowReset } from '../draw/rowNext';

const fId = ZicSynth.FloatId;
const sId = ZicSynth.StringId;

let saveAs = '';

interface WavetableState {
    wavetable: Wavetable;
    name: string;
    morph: number;
}

const wavetables: WavetableState[] = [];

export function zicSynthInit(patch: Patch) {
    saveAs = patch.name;
}

const col = config.screen.col;

const add = config.screen.col === 1 ? 3 : 1;
const rowAddGraph = config.screen.col === 1 ? () => rowGetAndAdd(add) : () => rowGet();

// TODO should there be on top a way to change of seq??
export default function (patch: Patch, scrollY: number) {
    rowReset();
    if (
        !wavetables[sId.oscWavetable] ||
        patch.strings[sId.oscWavetable] !== wavetables[sId.oscWavetable].name ||
        patch.floats[fId.Morph] !== wavetables[sId.oscWavetable].morph
    ) {
        const name = patch.strings[sId.oscWavetable];
        const morph = patch.floats[fId.Morph];
        wavetables[sId.oscWavetable] = {
            name,
            morph,
            wavetable: getWavetable(name, morph),
        };
    }
    let wavetable = wavetables[sId.oscWavetable];
    drawWavetable(wavetable.wavetable.data, { row: rowAddGraph(), col, scrollY });
    drawField(
        `Wavetable`,
        path.parse(wavetable.name).name,
        rowGetAndAdd(1),
        {
            edit: async (direction) => {
                patch.setString(sId.oscWavetable, await getNextWaveTable(direction, wavetable.name));
            },
            steps: [1, 10],
        },
        { scrollY },
    );
    drawField(
        `Morph`,
        `${patch.floats[fId.Morph].toFixed(1)}/${wavetable.wavetable.wavetableCount}`,
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.Morph, minmax(patch.floats[fId.Morph] + direction, 0, 64));
            },
            steps: [0.1, 1],
        },
        { scrollY, info: `${wavetable.wavetable.wavetableSampleCount} samples` },
    );
    drawField(
        `Amplitude`,
        ` ${Math.round(patch.floats[fId.OscAmplitude] * 100)}`,
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.OscAmplitude, minmax(patch.floats[fId.OscAmplitude] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        { scrollY, info: `%` },
    );
    drawField(
        `Frequency`,
        patch.floats[fId.OscFrequency].toString(),
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.OscFrequency, minmax(patch.floats[fId.OscFrequency] + direction, 10, 2000));
            },
            steps: [1, 10],
        },
        { scrollY, info: `hz` },
    );

    drawField(
        `Volume`,
        Math.round(patch.floats[fId.Volume] * 100).toString(),
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        { scrollY, col, info: `%` },
    );

    drawFieldDual(
        `Filter`,
        patch.floats[fId.filterCutoff].toString(),
        ` ${Math.round(patch.floats[fId.filterResonance] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.filterCutoff, minmax(patch.floats[fId.filterCutoff] + direction, 200, 8000));
            },
            steps: [10, 100],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.filterResonance, minmax(patch.floats[fId.filterResonance] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: 'hz', info2: '% res', scrollY },
    );
    drawField(
        `Type`,
        `${FilterNames[patch.floats[fId.filterMode]]}`,
        rowNext(col), //rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.filterMode,
                    minmax(patch.floats[fId.filterMode] + direction, 0, FilterMode.COUNT - 1),
                );
            },
        },
        {
            col,
            scrollY,
        },
    );

    drawField(
        `Attack`,
        patch.floats[fId.envAttack].toString(),
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envAttack,
                    minmax(patch.floats[fId.envAttack] + direction, 0, 9900),
                );
            },
            steps: [10, 100],
        },
        {
            scrollY,
            info: `ms`,
        },
    );

    drawField(
        `Decay`,
        patch.floats[fId.envDecay].toString(),
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envDecay,
                    minmax(patch.floats[fId.envAttack] + direction, 0, 9900),
                );
            },
            steps: [10, 100],
        },
        {
            scrollY,
            info: `ms`,
        },
    );

    drawField(
        `Sustain`,
        Math.round(patch.floats[fId.envSustain] * 100).toString(),
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envSustain, minmax(patch.floats[fId.envSustain] + direction, 0, 1));
            },
            steps: [0.01, 0.1],
        },
        {
            scrollY,
            info: `%`,
        },
    );

    drawField(
        `Release`,
        patch.floats[fId.envRelease].toString(),
        rowGetAndAdd(1),
        {
            edit: (direction) => {
                patch.setNumber(
                    fId.envRelease,
                    minmax(patch.floats[fId.envAttack] + direction, 0, 9900),
                );
            },
            steps: [10, 100],
        },
        {
            scrollY,
            info: `ms`,
        },
    );

    drawFieldDual(
        `Env. Osc.`,
        ` ${Math.round(patch.floats[fId.envModPitch] * 100)}`,
        ` ${Math.round(patch.floats[fId.envModAmplitude] * 100)}`,
        rowNext(1),
        {
            edit: (direction) => {
                patch.setNumber(fId.envModPitch, minmax(patch.floats[fId.envModPitch] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.envModAmplitude, minmax(patch.floats[fId.envModAmplitude] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: '%frq', info2: '%amp', scrollY },
    );

    drawFieldDual(
        `Env. Filter`,
        ` ${Math.round(patch.floats[fId.envModCutoff] * 100)}`,
        ` ${Math.round(patch.floats[fId.envModResonance] * 100)}`,
        rowNext(col),
        {
            edit: (direction) => {
                patch.setNumber(fId.envModCutoff, minmax(patch.floats[fId.envModCutoff] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        {
            edit: (direction) => {
                patch.setNumber(fId.envModResonance, minmax(patch.floats[fId.envModResonance] + direction, 0, 1));
            },
            steps: [0.01, 0.05],
        },
        { info: '%frq', info2: '%res', scrollY, col },
    );
}
