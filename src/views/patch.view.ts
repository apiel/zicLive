import { clear, drawText } from 'zic_node_ui';
import { currentPatchId, getPatch } from '../patch';
import { getSelectedSequence } from '../sequence';
import { color } from '../style';
import { getKick23 } from '../patches/kick23';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { encodersHandler, encodersView } from '../layout/encoders.layout';
import { MidiMsg } from '../midi';

function getPatchView() {
    const patch = getPatch(currentPatchId);

    switch (patch.engine.name) {
        case 'synth':
            break;
        case 'midi':
            break;
        case 'kick23':
            return getKick23();
    }
}

export async function patchView(options: RenderOptions = {}) {
    // if (controllerRendering) {
    //     // sequencerController();
    // }

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

    const { encoders, header } = getKick23();
    encodersView(encoders);

    await header();

    renderMessage();
}

export function patchMidiHandler(midiMsg: MidiMsg, viewPadPressed: boolean) {
    const view = getPatchView();
    if (!view) {
        return false;
    }
    return encodersHandler(view.encoders, midiMsg);
}
