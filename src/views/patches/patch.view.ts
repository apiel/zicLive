import { clear, drawText } from 'zic_node_ui';
import { currentPatchId, getPatch } from '../../patch';
import { color } from '../../style';
import { kick23 } from './kick23';
import { RenderOptions, viewPadPressed } from '../../view';
import { renderMessage } from '../../draw/drawMessage';
import { encodersHandler, encodersView } from '../../layout/encoders.layout';
import { MidiMsg, MIDI_TYPE } from '../../midi';
import { akaiApcKey25 } from '../../midi/akaiApcKey25';
import { synth } from './synth';
import {
    sequencerController,
    sequenceSelectMidiHandler,
    sequencePlayStopMidiHandler,
    bankController,
} from '../controller/sequencerController';
import { patchController, patchPadMidiHandler } from '../controller/patchController';
import { pageMidiHandler } from '../controller/pageController';

export function getPatchView() {
    const patch = getPatch(currentPatchId);

    switch (patch.engine.name) {
        case 'synth':
            return synth;
        case 'midi':
            break;
        case 'kick23':
            return kick23;
    }
}

export async function patchView({ controllerRendering }: RenderOptions = {}) {
    const view = getPatchView();

    if (controllerRendering) {
        sequencerController();
        if (viewPadPressed) {
            bankController();
        } else {
            patchController(view?.views.length, view?.currentView);
        }
    }

    clear(color.background);

    if (!view) {
        const patch = getPatch(currentPatchId);
        drawText(`No patch view for ${patch.engine.name}`, { x: 10, y: 10 });
        return;
    }

    const { encoders, header } = view.data;
    encodersView(encoders);

    header();

    renderMessage();
}

export async function patchMidiHandler(midiMsg: MidiMsg) {
    if (viewPadPressed && (await sequencePlayStopMidiHandler(midiMsg))) {
        return true;
    }

    if (sequenceSelectMidiHandler(midiMsg) || patchPadMidiHandler(midiMsg)) {
        return true;
    }

    const view = getPatchView();
    if (!view) {
        return false;
    }

    if (pageMidiHandler(midiMsg, view.changeView.bind(view))) {
        return true;
    }

    return encodersHandler(view.data.encoders, midiMsg);
}
