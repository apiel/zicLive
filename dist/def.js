"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beatViews = exports.View = void 0;
var View;
(function (View) {
    View["Sequencer"] = "Sequencer";
    View["SequencerEdit"] = "SequencerEdit";
    View["Patch"] = "Patch";
    View["Master"] = "Master";
    View["Project"] = "Project";
    View["Help"] = "Help";
})(View = exports.View || (exports.View = {}));
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
exports.beatViews = [View.Sequencer, View.SequencerEdit];
