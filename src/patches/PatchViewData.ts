import { Encoders } from '../layout/encoders.layout';
import { currentPatchId } from '../patch';
import { minmax } from '../util';

// TODO when pressing patch view button several time switch between views
// TODO long press patch view button to allow to select a different patch
// TODO should we find a way to switch patch part of selected sequence?
//   Right now we are browsing through all patch. But could be interest to
//   be able to browse only through patch of the selected sequence...

export class PatchViewData {
    currentView = 0;
    lastPatchId = currentPatchId;

    changeView(direction: number) {
        this.currentView = minmax(this.currentView + direction, 0, this.views.length - 1);
    }

    resetView() {
        this.currentView = 0;
    }

    get data() {
        // reset view if patch changed
        if (this.lastPatchId !== currentPatchId) {
            this.resetView();
            this.lastPatchId = currentPatchId;
        }
        return this.views[this.currentView];
    }

    constructor(
        public views: {
            encoders: Encoders;
            header: () => void;
        }[],
    ) {}
}
