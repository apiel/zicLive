export enum View {
    Sequencer,
    SequencerEdit,
    Pattern,
    Preset, // Patch preset (patch connot be changed as they done programmatically, but setting of the patch can be saved as preset)
    Master, // Master Volume, Tempo, FX, etc... (mixer?, scatter?)
    Project,
    Help,
}