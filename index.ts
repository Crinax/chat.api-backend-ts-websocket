import WebSocket = require("ws");
(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
import { Listener } from "./listener";


type TListeners = {
    [key:string]: Listener
}
var listeners:TListeners = {
    users: new Listener('http://chat.api/api/get-users/', 'POST'),
    messages: new Listener('http://chat.api/api/get-messages/', 'POST'),
    push: new Listener('http://chat.api/api/push-message/', 'POST'),
    last: new Listener('http://chat.api/api/message/', 'POST')
}

const onConnect = (client: WebSocket) => {
    client.on('message', (message:string) => {
        const data = JSON.parse(message);
        if (listeners.hasOwnProperty(data['target'])) {
            listeners[data['target']].send(data['body']);
            const resultObj = listeners[data['target']].getResult();
            const resultJSON = JSON.stringify(resultObj);
            client.send(resultJSON);
        }
        else {
            client.send(
                JSON.stringify({
                    status: 'error',
                    code: '1',
                    message: `Unknown target: '${data['target']}'`
                })
            );
        }
    });
}
const server:WebSocket.Server = new WebSocket.Server({port: 9000});
server.on('connection', onConnect);
