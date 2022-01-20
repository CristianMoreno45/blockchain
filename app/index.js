const express = require('express');
const bodyParser = require('body-parser')
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc,tp);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {

    const block = bc.addBlock(req.body.data);
    console.log(`Nuevo bloque agregado: ${block.toString()}`);
    p2pServer.syncChains();
    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

app.post('/transac', (req, res) => {
    let {recipient, amount} = req.body;

    const transaccion = wallet.createTransaction(recipient, amount, tp);
    console.log(`Nuevo bloque agregado: ${transaccion.toString()}`);
    p2pServer.broadcastTransaction(transaccion);
    res.redirect('/transactions');
});

app.listen(HTTP_PORT, () => console.log(`Escuchando por el puerto ${HTTP_PORT}.`));
p2pServer.listen();