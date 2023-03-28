import { getSelectedSequence } from '../../sequence';
import { minmax } from '../../util';

export let currentStep = -1;
export function changePage(direction: number) {
    const { stepCount } = getSelectedSequence();
    currentStep = minmax(currentStep + direction, -1, stepCount - 1); // - 1 is the main page
}

export function setCurrentStep(step: number) {
    currentStep = step;
}
