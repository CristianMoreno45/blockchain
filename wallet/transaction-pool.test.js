const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const { newTransaction } = require('./transaction');

describe('Probar la clase TransactionPool', () => {
    let tc = new TransactionPool();

    let wallet = new Wallet();
    let transaction = new Transaction();


    beforeEach(() => {
        tc = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'bar_R3c1P1enT', 40);
        tc.addOrUpdateTransaction(transaction);
    });

    it('Debe comprobar que se haya creado una transacción en el Pool', () => {
        expect(tc.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('Debe comprobar que se haya actualizado una transacción en el Pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo_R3c1P1enT', 60);
        expect(JSON.stringify(tc.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });
});
