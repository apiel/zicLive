import { connect, createServer, Server, Socket } from 'net';
import { MidiMessage } from 'zic_node';
import { handleMidi } from './midi';

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
                        handleMidi(data);
                        // console.log(data);
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

export function sendTcpMidi(data: MidiMessage) {
    if (client) {
        try {
            const jsonData = JSON.stringify(data);
            client.write(jsonData + '\n');   
        } catch (error) {
            console.error('SendTcpMidi error:', error);
        }
    }
}

let retry = 0;
export function startClient(host: string) {
    console.log('connecting to server...');
    client = connect({ port, host }, () => {
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

    client.on('end', function () {
        console.log('disconnected from server');
        client = undefined;
    });
}
