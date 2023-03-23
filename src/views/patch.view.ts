import { clear, drawText } from 'zic_node_ui';
import { currentPatchId, getPatch } from '../patch';
import { getSelectedSequence } from '../sequence';
import { color } from '../style';
import { kick23 } from '../patches/kick23';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { encodersHandler, encodersView } from '../layout/encoders.layout';
import { MidiMsg, MIDI_TYPE } from '../midi';
import { akaiApcKey25 } from '../midi/akaiApcKey25';
import { synth } from '../patches/synth';
import { sequencerController, sequenceSelectMidiHandler, sequenceToggleMidiHandler } from './controller/sequencerController';

function getPatchView() {
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
    if (controllerRendering) {
        sequencerController();
    }

    clear(color.background);

    const sequence = getSelectedSequence();
    if (!sequence) {
        drawText(`No patch selected`, { x: 10, y: 10 });
        return;
    }

    const view = getPatchView();
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

export async function patchMidiHandler(midiMsg: MidiMsg, viewPadPressed: boolean) {
    if (sequenceSelectMidiHandler(midiMsg, viewPadPressed)) {
        return true;
    }
    if (await sequenceToggleMidiHandler(midiMsg)) {
        return true;
    }

    const view = getPatchView();
    if (!view) {
        return false;
    }
    if (midiMsg.isController) {
        switch (midiMsg.message[1]) {
            case akaiApcKey25.pad.down: {
                if (midiMsg.message[0] === MIDI_TYPE.KEY_RELEASED) {
                    view.changeView(+1);
                    return true;
                }
                return false;
            }
            case akaiApcKey25.pad.up: {
                if (midiMsg.message[0] === MIDI_TYPE.KEY_RELEASED) {
                    view.changeView(-1);
                    return true;
                }
                return false;
            }
        }
    }
    return encodersHandler(view.data.encoders, midiMsg);
}
