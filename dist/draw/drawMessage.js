"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawError = exports.withInfo = exports.withSuccess = exports.renderMessage = exports.drawMessage = exports.Message = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("../config");
const style_1 = require("../style");
const view_1 = require("../view");
var Message;
(function (Message) {
    Message[Message["Info"] = 0] = "Info";
    Message[Message["Success"] = 1] = "Success";
    Message[Message["Error"] = 2] = "Error";
    Message[Message["None"] = 3] = "None";
})(Message = exports.Message || (exports.Message = {}));
let messageTimeout;
let message = '';
let messageType = Message.None;
async function drawMessage(_message, type = Message.Info) {
    message = _message;
    messageType = type;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(async () => {
        messageType = Message.None;
        await (0, view_1.renderView)();
        (0, zic_node_ui_1.render)();
    }, 2000);
}
exports.drawMessage = drawMessage;
function renderMessage() {
    if (messageType !== Message.None) {
        (0, zic_node_ui_1.setColor)(style_1.color.message[messageType]);
        (0, zic_node_ui_1.drawFilledRect)({ position: { x: 0, y: 0 }, size: { w: config_1.config.screen.size.w, h: style_1.unit.height - 5 } });
        (0, zic_node_ui_1.drawText)(message, { x: 10, y: 1 }, { color: style_1.color.white });
    }
}
exports.renderMessage = renderMessage;
function withSuccess(message, fn) {
    return async (...args) => {
        const result = await fn(...args);
        drawMessage(message, Message.Success);
        return result;
    };
}
exports.withSuccess = withSuccess;
function withInfo(message, fn) {
    return async (...args) => {
        const result = await fn(...args);
        drawMessage(message);
        return result;
    };
}
exports.withInfo = withInfo;
function drawError(message) {
    drawMessage(message, Message.Error);
}
exports.drawError = drawError;
