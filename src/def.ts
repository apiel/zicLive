export enum View {
    Sequencer = 'Sequencer',
    SequencerEdit = 'SequencerEdit',
    Patch = 'Patch',
    Master = 'Master', // Master Volume, Tempo, FX, etc... (mixer?, scatter?)
    Project = 'Project', // Project settings (name, bpm, etc...)
    Help = 'Help',
}

// export const View = {
//     Sequencer: 'Sequencer',
//     SequencerEdit: 'SequencerEdit',
//     Pattern: 'Pattern',
//     Patch: 'Patch',
//     Master: 'Master',
//     Project: 'Project',
//     Help: 'Help',
// };

// export const viewName = [
//     'Sequencer',
//     'SequencerEdit',
//     'Pattern',
//     'Patch',
//     'Master',
//     'Project',
//     'Help',
// ];
// Could even get types like this:
// type ViewName = (typeof viewName)[number];

export const beatViews = [View.Sequencer, View.SequencerEdit] as const;
