import { drawFilledRect, drawText, render, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, unit } from '../style';
import { renderView } from '../view';

export enum Message {
    Info,
    Success,
    Error,
    None,
}

let messageTimeout: NodeJS.Timeout;
let message = '';
let messageType = Message.None;

export function drawMessage(_message: string, type: Message = Message.Info) {
    message = _message;
    messageType = type;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(async () => {
        messageType = Message.None;
        await renderView();
        render();
    }, 2000);
}

export function renderMessage() {
    if (messageType !== Message.None) {
        setColor(color.message.background);
        drawFilledRect({ position: { x: 0, y: 0 }, size: { w: config.screen.size.w, h: unit.height - 5 } });
        drawText(message, { x: 10, y: 1 }, { color: color.message.text[messageType] });
        setColor(color.message.text[messageType]);
        drawFilledRect({ position: { x: 0, y: unit.height - 5 }, size: { w: config.screen.size.w, h: 2 } });
    }
}
