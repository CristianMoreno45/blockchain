const Websocket = require('ws');
const Blockchain = require('../blockchain/index');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPE = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
}


class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = new Blockchain();
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Escuchando para peer-to-peer conexiones en: ${P2P_PORT}`);

    }

    connectToPeers() {
        console.log('Conectando con pares');
        //console.log('peers', peers);
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }
    connectSocket(socket) {
        console.log('Conectando con socket');
        this.sockets.push(socket);
        console.log('Socket conectado');
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    messageHandler(socket) {
        console.log('Agregando mensaje al socket');
        socket.on('message', message => {
            const data = JSON.parse(message);
            console.log('data', data);
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPE.transaction:
                    this.transactionPool.addOrUpdateTransaction(data.transaction);
                    break;
            }

        });
    }

    sendChain(socket) {
        console.log('Enviando cadena al socket');
        socket.send(JSON.stringify(
            {
                type: MESSAGE_TYPE.chain,
                chain: this.blockchain.chain
            }));
    }

    sendTransaction(socket, transaction) {
        console.log('Enviando transacción al socket');
        socket.send(JSON.stringify(
            {
                type: MESSAGE_TYPE.transaction,
                transaction
            }));
    }

    syncChains() {
        console.log('Sincronizando cadenas');
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction) {
        console.log('Sincronizando transacciones');
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }
}

module.exports = P2pServer;