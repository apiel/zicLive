import { currentPatchId } from '../../patch';
import { minmax } from '../../util';
import { kick23EnvAmp } from './kick23EnvAmp';
import { kick23EnvFreq } from './kick23EnvFreq';
import { kick23Main } from './kick23Main';
import { kick23Wavetable } from './kick23Wavetable';

const kick23Views = [kick23Main, kick23Wavetable, kick23EnvAmp, kick23EnvFreq];

let currentView = 0;
let lastPatchId = currentPatchId;

function changeView(direction: number) {
    currentView = minmax(currentView + direction, 0, kick23Views.length - 1);
}

function resetView() {
    currentView = 0;
}

// TODO when pressing patch view button several time switch between views
// TODO long press patch view button to allow to select a different patch
// TODO should we find a way to switch patch part of selected sequence? 
//   Right now we are browsing through all patch. But could be interest to
//   be able to browse only through patch of the selected sequence...

export function getKick23() {
    // reset view if patch changed
    if (lastPatchId !== currentPatchId) {
        resetView();
        lastPatchId = currentPatchId;
    }
    return { ...kick23Views[currentView], changeView, resetView };
}
