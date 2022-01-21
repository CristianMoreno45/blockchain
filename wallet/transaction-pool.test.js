const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('Probar la clase TransactionPool', () => {
    let tp = new TransactionPool();
    let wallet = new Wallet();
    let transaction = new Transaction();

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'bar_R3c1P1enT', 40);
        tp.addOrUpdateTransaction(transaction);
    });

    it('Debe comprobar que se haya creado una transacción en el Pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('Debe comprobar que se haya actualizado una transacción en el Pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo_R3c1P1enT', 60);
        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

    it('Debe limpiar la cola de tarnsacciones', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('Validar transacciones validas', () => {
        let validTransactions;
        let bc = new Blockchain();

        beforeEach(() => {
            bc = new Blockchain();
            validTransactions = [...tp.transactions];

            for (let i = 0; i < 6; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('foo_R3c1P1enT', 60, bc, tp);
                if (i % 2 == 0) {
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });

        it('Debe resolver que la cantidad de transacciones validas esperadas son diferntes a las obtenidas', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('Debe resolver que la cantidad de transacciones validas esperadas son diferntes a las obtenidas', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });
    });

});
