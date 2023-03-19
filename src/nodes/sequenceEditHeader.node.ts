import { drawFilledRect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { getSelectedSequence } from '../sequence';
import { color, unit } from '../style';
import { patternPreviewNode } from './patternPreview.node';
import { sequenceMiniGridSelection } from './sequenceMiniGridSelection.node';

const { margin } = unit;

export function sequenceEditHeader(currentStep?: number) {
    const { trackId, stepCount, steps, activeStep } = getSelectedSequence();
    sequenceMiniGridSelection();

    if (trackId !== undefined) {
        const patternPreviewPosition = { x: 165, y: margin };
        const patternPreviewRect = {
            position: patternPreviewPosition,
            size: { w: config.screen.size.w - (patternPreviewPosition.x + margin * 2), h: 83 },
        };
        setColor(color.foreground);
        drawFilledRect(patternPreviewRect);
        patternPreviewNode(patternPreviewRect, stepCount, steps, activeStep, currentStep);
    }
}
