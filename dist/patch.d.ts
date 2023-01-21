export interface Patch {
    id: number;
    name: string;
}
export declare const getPatches: (engine: string) => Patch[];
export declare const getPatch: (engine: string, patchId: number) => Patch;
export declare function loadPatches(): Promise<void>;
//# sourceMappingURL=patch.d.ts.map