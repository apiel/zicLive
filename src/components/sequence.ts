import { drawFilledRect, drawLine, drawRect, drawText, Point, setColor } from 'zic_node_ui';
import { color, font } from '../style';
import { config } from '../config';
import { Pattern } from '../pattern';
import { Track } from '../track';
import { Patch, Preset } from '../patch';

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

    renderPattern({ x: position.x + 2, y: position.y + 15 }, props.pattern, props.playing);
}

function renderPattern(position: Point, pattern: Pattern, playing: boolean) {
    setColor(playing ? color.sequencer.pattern.playing : color.sequencer.pattern.waiting);
    const stepWidth = (size.w - 2) / pattern.stepCount;
    const notes = pattern.steps.flatMap((voices) => voices.map(({ note }) => note));
    const noteMin = Math.min(...notes);
    const noteRange = Math.max(...notes) - noteMin;

    if (noteRange === 0) {
        for (let step = 0; step < pattern.stepCount; step++) {
            const voices = pattern.steps[step];
            for (let voice = 0; voice < voices.length; voice++) {
                const rect = {
                    position: {
                        x: position.x + step * stepWidth,
                        y: position.y + 10,
                    },
                    size: {
                        w: stepWidth - 1,
                        h: 5,
                    },
                };
                drawFilledRect(rect);
            }
        }
    } else {
        for (let step = 0; step < pattern.stepCount; step++) {
            const voices = pattern.steps[step];
            for (let voice = 0; voice < voices.length; voice++) {
                const { note } = voices[voice];
                const point1 = {
                    x: position.x + step * stepWidth,
                    y: position.y + ((note - noteMin) / noteRange) * (size.h - 30),
                };
                const point2 = {
                    x: point1.x + stepWidth - 2,
                    y: point1.y,
                };
                drawLine(point1, point2);
            }
        }
    }
}
