import { connect, createServer, Server, Socket } from 'net';
import { MidiMessage } from 'zic_node';
import { handleMidi } from './midi';

const port = 2323;

let server: Server;
const connections: Socket[] = [];

export function startServer() {
    server = createServer((connection) => {
        console.log('client connected');
        connections.push(connection);

        connection.on('end', () => {
            console.log('client disconnected');
            connections.splice(connections.indexOf(connection), 1);
        });
        connection.pipe(connection);
    });

    server.listen(port, () => {
        console.log(`server is listening on port ${port}`);
    });
}

export function sendTcpMidi(data: MidiMessage) {
    if (server) {
        const jsonData = JSON.stringify(data);
        for (const connection of connections) {
            connection.write(jsonData + '\n');
        }
    }
}

let retry = 0;
export function startClient(host: string) {
    console.log('connecting to server...');
    const client = connect({ port, host }, () => {
        console.log('connected to server!');
    });

    client.on('error', (error) => {
        console.log('TCP client error:', error);
        if (retry++ < 5) {
            setTimeout(() => {
                startClient(host);
            }, 3000);
        }
    });

    client.on('data', function (buffer) {
        try {
            const lines = buffer.toString().split('\n');
            for (const line of lines) {
                if (line) {
                    const data = JSON.parse(line);
                    handleMidi(data);
                    // console.log(data);
                }
            }
        } catch (error) {
            console.error('TCP error:', error, buffer.toString());
        }
    });

    client.on('end', function () {
        console.log('disconnected from server');
    });
}
