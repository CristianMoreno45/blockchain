const ChainUtil = require('../chain-util');

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

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this();

        if (amount > senderWallet.balance) {
            console.log(`Cantidad: ${amount} excede el saldo.`);
            return;
        }
        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ]);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
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