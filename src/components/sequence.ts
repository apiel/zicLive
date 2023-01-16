import { drawFilledRect, drawLine, drawRect, drawText, Point, setColor } from 'zic_node_ui';
import { color, font } from '../style';
import { config } from '../config';
import { Pattern } from '../pattern';
import { Track } from '../track';
import { Patch, Preset } from '../patch';
import { patternPreview } from './patternPreview';

const windowPadding = 1;
const margin = 1;
const col = 4;
const size = { w: config.screen.size.w / col - margin, h: 49 };

interface Props {
    track: Track;
    selected: boolean;
    playing: boolean;
    detune: number;
    nextSequenceId?: number;
    repeat: number;
    pattern: Pattern;
    activeStep?: number;
    patch: Patch;
    preset: Preset;
}

export function sequence(id: number, props: Props) {
    setColor(props.playing ? color.sequencer.playing : color.foreground);
    const position = {
        x: windowPadding + (margin + size.w) * (id % col),
        y: windowPadding + (margin + size.h) * Math.floor(id / col),
    };
    drawFilledRect({ position, size });

    if (props.selected) {
        setColor(color.sequencer.selected);
        drawRect({ position, size });
    }

    drawText(
        `${id + 1}`,
        { x: position.x + 2, y: position.y + 1 },
        { color: color.tracks[props.track.id], size: 10, font: font.bold },
    );

    drawText(
        `${props.patch.name}`,
        { x: position.x + 15, y: position.y + 1 },
        { color: color.tracks[props.track.id], size: 10, font: font.regular },
    );

    drawText(
        `${props.preset.id}`,
        { x: position.x + 90, y: position.y + 1 },
        { color: color.sequencer.info, size: 10, font: font.regular },
    );

    drawText(
        `${props.detune < 0 ? props.detune : `+${props.detune}`} x${props.repeat}${
            props.nextSequenceId !== undefined ? ` >${props.nextSequenceId + 1}` : ''
        }`,
        { x: position.x + 2, y: position.y + 37 },
        { color: color.sequencer.info, size: 10, font: font.regular },
    );

    patternPreview(
        { x: position.x + 2, y: position.y + 15 },
        { w: size.w, h: size.h - 30 },
        props.pattern,
        props.playing,
    );
    if (props.activeStep !== undefined && props.playing) {
        renderActiveStep(
            { x: position.x + 2, y: position.y + 15 },
            props.pattern,
            props.activeStep,
        );
    }
}

function renderActiveStep(position: Point, pattern: Pattern, step: number) {
    setColor(color.sequencer.pattern.playing);
    const stepWidth = (size.w - 2) / pattern.stepCount;
    drawLine(
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y },
        { x: position.x + step * stepWidth + stepWidth * 0.5, y: position.y + 20 },
    );
}
