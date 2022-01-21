const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
        publicKey  : ${this.publicKey.toString()}
        balance    : ${this.balance}`;
    }
    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);
        if (amount > this.balance) {
            console.log(`El monto ${amount} excede el saldo actual ${this.balance}.`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);
        if (transaction) {
            transaction = transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.addOrUpdateTransaction(transaction);
        }
        return transaction;

    }

    calculateBalance(blockchain, test = null) {
        let balance = this.balance;
        let transactions = [];

        blockchain.chain.forEach(block =>
            block.data.forEach(transaction => {
                transactions.push(transaction)
            })
        );

        const walletInputTs = transactions
            .filter(transaction => transaction.input.address === this.publicKey);

        if (test) {
            console.log(`Wallet's public key: ${ this.publicKey }`);
        }
        
        let startTime = 0;

        if (walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce(
                (prev, current) => prev.input.timmeStamp > current.input.timmeStamp ? prev : current
            );

            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timmeStamp;
        }

        transactions.forEach(transaction => {
            if (transaction.input.timmeStamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount
                    }
                })
            }
        });
        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;