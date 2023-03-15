import { Engine } from './config';
export declare let currentPatchId: number;
export declare function setCurrentPatchId(id: number): void;
export declare class Patch {
    readonly id: number;
    protected filename: string;
    isModified: boolean;
    engine: Engine;
    name: string;
    floats: {
        [id: number]: number;
    };
    strings: {
        [id: number]: string;
    };
    cc: {
        [id: number]: number;
    };
    setString(stringId: number, value: string): void;
    setNumber(floatId: number, value: number): void;
    setCc(ccId: number, value: number): void;
    constructor(id: number);
    save(): Promise<void>;
    load(): Promise<void>;
    set({ id, ...patch }: Partial<Patch>): void;
}
export declare const patches: Patch[];
export declare const getPatch: (patchId: number) => Patch;
export declare function loadPatches(): Promise<void>;
export declare function savePatchAs(patch: Patch, as: string): Promise<void>;
//# sourceMappingURL=patch.d.ts.map