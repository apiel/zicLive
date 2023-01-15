import { drawFilledRect, drawLine, drawRect, drawText, Point, setColor } from 'zic_node_ui';
import { color, font } from '../style';
import { config } from '../config';
import { Pattern } from '../pattern';

const windowPadding = 1;
const margin = 1;
const col = 4;
const size = { w: config.screen.size.w / col - margin, h: 40 };

interface Props {
    track: number;
    selected: boolean;
    playing: boolean;
    detune: number;
    nextSequenceId?: number;
    repeat: number;
    pattern: Pattern;
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
        { color: color.tracks[props.track], size: 10, font: font.bold },
    );

    renderPattern({ x: position.x + 2, y: position.y + 15 }, props.pattern);
}

function renderPattern(position: Point, pattern: Pattern) {
    setColor(color.sequencer.pattern);
    const stepWidth = size.w / pattern.stepCount;
    const notes = pattern.steps.flatMap((voices) => voices.map(({ note }) => note));
    const noteMin = Math.min(...notes);
    const noteRange = Math.max(...notes) - noteMin;

    for (let step = 0; step < pattern.stepCount; step++) {
        const voices = pattern.steps[step];
        for (let voice = 0; voice < voices.length; voice++) {
            const { note } = voices[voice];
            const point1 = {
                x: position.x + step * stepWidth,
                y: position.y + (note - noteMin) / noteRange * size.h,
            };
            const point2 = {
                x: point1.x + stepWidth,
                y: point1.y,
            };
            drawLine(point1, point2);
        }
    }

    // for (let step = 0; step < pattern.stepCount; step++) {
    //     const stepPosition = { x: position.x + step * stepSize.w, y: position.y };
    //     drawRect({ position: stepPosition, size: stepSize });
    //     const notes = pattern.steps[step];
    //     if (notes.length > 0) {
    //         const noteSize = { w: stepSize.w, h: stepSize.h / notes.length };
    //         for (let note = 0; note < notes.length; note++) {
    //             const notePosition = {
    //                 x: stepPosition.x,
    //                 y: stepPosition.y + note * noteSize.h,
    //             };
    //             drawFilledRect({ position: notePosition, size: noteSize });
    //         }
    //     }
    // }
}
