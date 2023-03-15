"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startClient = exports.sendTcpMidi = exports.startServer = void 0;
const net_1 = require("net");
const midi_1 = require("./midi");
const port = 2323;
let server;
function startServer() {
    server = (0, net_1.createServer)((connection) => {
        console.log('client connected');
        connection.on('end', () => {
            console.log('client disconnected');
        });
        connection.on('data', (buffer) => {
            try {
                const lines = buffer.toString().split('\n');
                for (const line of lines) {
                    if (line) {
                        const data = JSON.parse(line);
                        console.log(data);
                        (0, midi_1.handleMidi)(data);
                    }
                }
            }
            catch (error) {
                console.error('TCP error:', error, buffer.toString());
            }
        });
        connection.pipe(connection);
    });
    server.listen(port, () => {
        console.log(`server is listening on port ${port}`);
    });
}
exports.startServer = startServer;
let client;
function sendTcpMidi(data) {
    if (client) {
        try {
            const jsonData = JSON.stringify(data);
            client.write(jsonData + '\n');
        }
        catch (error) {
            console.error('SendTcpMidi error:', error);
        }
    }
}
exports.sendTcpMidi = sendTcpMidi;
function startClient(host) {
    console.log('connecting to server...');
    client = (0, net_1.connect)({ port, host }, () => {
        console.log('connected to server!');
    });
    client.on('error', (error) => {
        console.log('TCP client error:', error);
        setTimeout(() => {
            startClient(host);
        }, 3000);
    });
    client.on('end', function () {
        console.log('disconnected from server');
        client = undefined;
        setTimeout(() => {
            startClient(host);
        }, 3000);
    });
}
exports.startClient = startClient;
