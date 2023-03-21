import { minmax } from '../../util';
import { kick23Main } from './kick23Main';
import { kick23Wavetable } from './kick23Wavetable';

const kick23Views = [kick23Main, kick23Wavetable];

let currentView = 0;

function changeView(direction: number) {
    currentView = minmax(currentView + direction, 0, kick23Views.length - 1);
}

function resetView() {
    currentView = 0;
}

export function getKick23() {
    return { ...kick23Views[currentView], changeView, resetView };
}
