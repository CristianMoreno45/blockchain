const ChainUtil = require('../chain-util');
const { MINE_REWARD, MINE_RATE } = require('../config');

class Transaction {
    /**
        transaction : {

                outputs : [
                    { 
                        amount:  // Nuevo saldo de la billetera que hace la transferencia
                        address: // Llave publica de la billetera que hace la transferencia
                    },
                    { 
                        amount:  // Valor de la operación
                        address: // quien recibe la transferencia
                    }
                ],
                input : {
                    timeStamp:  // Fecha y hora de la transacción
                    amount:     // Saldo de la billetera que hace la transferencia
                    address:    // Llave publica de la billetera que hace la transferencia
                    signature:  // Firma de la transacción
                },
            }
    */
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if (amount > senderOutput.amount) {
            // en este punto amount es igual al saldo de la billetera
            console.log(`Cantidad: ${amount} excede el saldo.`);
            return;
        }
        senderOutput.amount -= amount;
        this.outputs.push({ amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);
        return this;

    }


    static getTransactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }


    static newTransaction(senderWallet, recipient, amount) {

        if (amount > senderWallet.balance) {
            console.log(`Cantidad: ${amount} excede el saldo.`);
            return;
        }

        return Transaction.getTransactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ]);
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.getTransactionWithOutputs(blockchainWallet, [
            {
                amount: MINE_REWARD,
                address: minerWallet.publicKey
            }
        ]);
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timeStamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }

    static verifySignature(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }


}

module.exports = Transaction;