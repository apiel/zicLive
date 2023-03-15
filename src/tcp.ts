import { connect, createServer, Server, Socket } from 'net';
import { handleMidi, MidiMsg } from './midi';

const port = 2323;

let server: Server;

export function startServer() {
    server = createServer((connection) => {
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
                        handleMidi(data);
                    }
                }
            } catch (error) {
                console.error('TCP error:', error, buffer.toString());
            }
        });

        connection.pipe(connection);
    });

    server.listen(port, () => {
        console.log(`server is listening on port ${port}`);
    });
}

let client: Socket | undefined;

export function sendTcpMidi(data: MidiMsg) {
    if (client) {
        try {
            const jsonData = JSON.stringify(data);
            client.write(jsonData + '\n');
        } catch (error) {
            console.error('SendTcpMidi error:', error);
        }
    }
}

export function startClient(host: string) {
    console.log('connecting to server...');
    client = connect({ port, host }, () => {
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
