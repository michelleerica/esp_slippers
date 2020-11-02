const WebSocketServer = require('websocket').server;
const http = require('http');
 
const kafka = require('kafka-node');
const Consumer = kafka.Consumer,
 client = new kafka.KafkaClient({kafkaHost: 'localhost:29092'}),
 consumer = new Consumer(
 client, [ { topic: 'example-topic', partition: 0 } ], { autoCommit: false });
 
const server = http.createServer(function(request, response) {
    console.log(' Request received : ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log('Listening on port : 8080');
});
 
webSocketServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 
function iSOriginAllowed(origin) {
    return true;
}
 
webSocketServer.on('request', function(request) {
    if (!iSOriginAllowed(request.origin)) {
        request.reject();
        console.log(' Connection from : ' + request.origin + ' rejected.');
        return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log(' Connection accepted : ' + request.origin);

    connection.on('message', function(message) {
    if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
    }
    });

    consumer.on('message', function (message) {
        console.log(message);
        connection.sendUTF(message.value);
    });

    connection.on('close', function(reasonCode) {
        console.log('Connection ' + connection.remoteAddress + ' disconnected.');
    });
});