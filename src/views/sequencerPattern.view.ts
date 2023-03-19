import { RenderOptions, viewPadPressed } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import { sequencerController, sequenceSelectMidiHandler } from './controller/sequencerController';
import { getSelectedSequence } from '../sequence';
import { minmax } from '../util';
import { Encoders, encodersHandler, encodersView } from './layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';
import { sequenceEncoder } from './sequencerEdit.view';

let currentStep = 0;

const encoders: Encoders = [
    {
        ...sequenceEncoder,
        handler: (direction) => {
            currentStep = 0;
            return sequenceEncoder.handler(direction);
        }
    },
    undefined,
    undefined,
    undefined,
    {
        title: 'step',
        getValue: () => `${currentStep + 1}`,
        handler: async (direction) => {
            const { stepCount } = getSelectedSequence();
            currentStep = minmax(currentStep + direction, 0, stepCount - 1);
            return true;
        },
        unit: () => {
            const { stepCount } = getSelectedSequence();
            return `/ ${stepCount}`;
        },
    },
    undefined,
    undefined,
    undefined,
];

export async function sequencerPatternView({ controllerRendering }: RenderOptions = {}) {
    // TODO implement init option to reset currentStep

    if (controllerRendering) {
        if (viewPadPressed) {
            sequencerController();
        } else {
            // pattern...
        }
    }

    encodersView(encoders);
    sequenceEditHeader(currentStep);

    renderMessage();
}

export async function sequencerPatternMidiHandler(midiMsg: MidiMsg, _viewPadPressed: boolean) {
    if (sequenceSelectMidiHandler(midiMsg, _viewPadPressed)) {
        return true;
    }
    return encodersHandler(encoders, midiMsg);
}
