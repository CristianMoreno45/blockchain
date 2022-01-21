const Transaction = require("./transaction");

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    addOrUpdateTransaction(transaction) {
        let transactionWithID = this.transactions.find(t => t.id === transaction.id);
        if (transactionWithID) {
            this.transactions[this.transactions.indexOf(transactionWithID)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    validTransactions() {
        return this.transactions.filter(t => {
            const outputTotal = t.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            if (t.input.amount !== outputTotal){
                console.log(`Transacción invalida para ${t.input.address}`);
                return;
            }
            if (!Transaction.verifySignature(t)){
                console.log(`Firma invalida para ${t.input.address}`);
                return;
            }
            return t;
        });    
    }

    clear(){
        this.transactions = [];
    }
}
module.exports = TransactionPool;