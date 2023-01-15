import { exit } from 'process';
import {
    open,
    close,
    getEvents,
    drawRect,
    render,
    setColor,
    Color,
    drawLine,
    drawPoint,
    drawText,
    drawFilledRect,
    rgb,
} from 'zic_node_ui';

open();

const red: Color = { r: 255, g: 0, b: 0 };
const white: Color = { r: 255, g: 255, b: 255 };
const blue: Color = rgb('#6189cb');
setColor(red);
drawRect({ point: { x: 10, y: 10 }, h: 100, w: 100 });
drawFilledRect({ point: { x: 30, y: 30 }, h: 100, w: 100 });
setColor(blue);
drawLine({ x: 10, y: 150 }, { x: 150, y: 150 });
drawPoint({ x: 5, y: 5 });
drawText('Hello World', { x: 10, y: 10 }, { color: white, size: 20 });
drawText('Hello', { x: 120, y: 10 }, { color: blue, font: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' });
drawText('without options', { x: 120, y: 30 });
render();

setInterval(() => {
    const events = getEvents();
    if (events.exit || events.keysDown?.includes(41)) {
        close();
        exit();
    } else if (events.keysDown || events.keysUp) {
        console.log('events', events);
    }
}, 10);