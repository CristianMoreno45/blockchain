const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Probar la clase Wallet', () => {
    let wallet = new Wallet();
    let tp = new TransactionPool();
    let bc = new Blockchain();
    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('Probar la creación de una transacción en la billetera', () => {
        let transaction = new Transaction();
        let sendAmount, recipient;
        beforeEach(() => {
            sendAmount = 50;
            recipient = 'bar_R3c1P1enT';

            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp)
        });

        describe('Probar la creación de una transacción duplicada', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
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
    describe('Probar la comprobación de saldo', () => {
        let addBalance, repeatAdd;
        let senderWallet = new Wallet();

        beforeEach(() => {

            repeatAdd = 3;
            addBalance = 100;
            senderWallet = new Wallet();
            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
            bc.addBlock(tp.transactions);
            tp.clear();
        });

        it('Debe corresponder el saldo de la billetera destino con la suma de las transacciones del blockchain', () => {
            console.log('bc', JSON.stringify(bc));
            const expectedValue = INITIAL_BALANCE + (addBalance * repeatAdd);
            const obtainededValue = wallet.calculateBalance(bc, true)
            console.log('expectedValue:',expectedValue, 'obtainededValue', obtainededValue);
            expect(obtainededValue).toEqual(expectedValue);
        });
        it('Debe corresponder el saldo de la billetera origen con la suma de las transacciones del blockchain', () => {
            const expectedValue = INITIAL_BALANCE - (addBalance * repeatAdd);
            const obtainededValue = senderWallet.calculateBalance(bc);
            console.log('expectedValue:',expectedValue, 'obtainededValue', obtainededValue);
            expect(obtainededValue).toEqual(expectedValue);
        });

        describe('Probar el comportameinto del destinatario', () => {
            let substractBalance, recipientBalance;
            beforeEach(() => {
                tp.clear();
                substractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, substractBalance, bc, tp);
                bc.addBlock(tp.transactions);
            });
            describe('Probar que el origen envia otra transacción al destinatario', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });
                it('Debe calcular el balance del destinatario usando unicamente las transacciones mas recientes', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - substractBalance + addBalance);
                });
            });

        });

    });
});
