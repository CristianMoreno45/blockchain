const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Probar el objeto Wallet', () => {
    let transaction = new Transaction();
    let wallet = new Wallet();
    let recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        recipient = 'P40l4Re1p13nT';
        amount = 50;

        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });
    it('Debe comprobar de que el nuevo saldo de la billetera corresponda al descrito en la operación', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });
    it('Debe comprobar de que el monto de la oepración corresponda al descrito en la operación', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    });

    it('Debe comprobar que el saldo de la billetera es igual a valor del monto de la entrada', () => {
        expect(transaction.input.amount)
            .toEqual(wallet.balance);
    });

    it('Debe valdar que la transacción posea una firma valida', () => {
        expect(Transaction.verifySignature(transaction)).toBe(true);
    });

    it('Debe invalidar la transacción', () => {
        transaction.outputs[0].amount = 5000;
        expect(Transaction.verifySignature(transaction)).toBe(false);
    });

    describe('Validar transaccion con un valor fuera del saldo', () => {
        beforeEach(() => {
            amount = 5000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it('No debe permitir crear la transacción', () => {
            expect(transaction)
                .toEqual(undefined);
        });
    });

    describe('Validar cuando se actualiza la transacción', () => {

        let nextRecipient, nextAmount;

        beforeEach(() => {
            nextAmount = 50;
            nextRecipient = 'F3l1pe_R3c1p13nT';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('Debe validar que el saldo se vea afectado por el nuevo movimiento', () => {
            expect(transaction.outputs.find(output=>  output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });
        it('Debe validar que el el monto de la segunda operación con el monto', () => {
            expect(transaction.outputs.find(output=>  output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });
   
    });


});
