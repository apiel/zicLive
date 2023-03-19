export enum View {
    Sequencer = 'Sequencer',
    SequencerEdit = 'SequencerEdit',
    SequencerPattern = 'SequencerPattern',
    Patch = 'Patch',
    Master = 'Master', // Master Volume, Tempo, FX, etc... (mixer?, scatter?)
    Project = 'Project', // Project settings (name, bpm, etc...)
}

export const beatViews = [View.Sequencer, View.SequencerEdit, View.SequencerPattern] as const;
