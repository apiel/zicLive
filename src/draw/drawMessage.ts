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
        setColor(color.message[messageType]);
        drawFilledRect({ position: { x: 0, y: 0 }, size: { w: config.screen.size.w, h: unit.height - 5 } });
        drawText(message, { x: 10, y: 1 }, { color: color.white });
    }
}

export function withSuccess<T = void>(message: string, fn: (...args: any[]) => Promise<T>) {
    return async (...args: any[]) => {
        const result = await fn(...args);
        drawMessage(message, Message.Success);
        return result;
    }
}

export function withInfo<T = void>(message: string, fn: (...args: any[]) => Promise<T>) {
    return async (...args: any[]) => {
        const result = await fn(...args);
        drawMessage(message);
        return result;
    }
}
