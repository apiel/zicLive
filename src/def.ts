export enum View {
    Sequencer = 'Sequencer',
    SequencerEdit = 'SequencerEdit',
    Pattern = 'Pattern',
    Preset = 'Preset', // Patch preset (patch connot be changed as they done programmatically, but setting of the patch can be saved as preset)
    Master = 'Master', // Master Volume, Tempo, FX, etc... (mixer?, scatter?)
    Project = 'Project', // Project settings (name, bpm, etc...)
    Help = 'Help',
}

// export const View = {
//     Sequencer: 'Sequencer',
//     SequencerEdit: 'SequencerEdit',
//     Pattern: 'Pattern',
//     Preset: 'Preset',
//     Master: 'Master',
//     Project: 'Project',
//     Help: 'Help',
// };

// export const viewName = [
//     'Sequencer',
//     'SequencerEdit',
//     'Pattern',
//     'Preset',
//     'Master',
//     'Project',
//     'Help',
// ];
// Could even get types like this:
// type ViewName = (typeof viewName)[number];

export const beatViews = [View.Sequencer, View.SequencerEdit] as const;
