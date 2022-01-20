const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');

describe('Probar la clase Wallet', () => {
    let wallet = new Wallet();
    let tp = new TransactionPool();

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('Probar la creación de una transacción en la billetera', () => {
        let transaction = new Transaction();
        let sendAmount, recipient;
        beforeEach(() => {
            sendAmount = 50;
            recipient = 'bar_R3c1P1enT';
            transaction = wallet.createTransaction(recipient, sendAmount, tp)
        });

        describe('Probar la creación de una transacción duplicada', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
            });
            it('Debe comprobar que la suma de las transacciones fueron debitadas del saldo', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toBe(wallet.balance - (sendAmount * 2));
            });

            it('Debe comprobar que lque existan dos transacciones con el mismo valor  al mismo destino', () => {
                expect(transaction.outputs
                    .filter(output => output.address === recipient)
                    .map(output => output.amount)
                ).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});
