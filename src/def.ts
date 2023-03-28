export enum View {
    Sequencer = 'Sequencer',
    SequencerEdit = 'SequencerEdit',
    Patch = 'Patch',
    PatchBak = 'PatchBak',
    Master = 'Master', // Master Volume, Tempo, FX, etc... (mixer?, scatter?)
    Project = 'Project', // Project settings (name, bpm, etc...)
}

export const beatViews = [View.Sequencer, View.SequencerEdit] as const;
