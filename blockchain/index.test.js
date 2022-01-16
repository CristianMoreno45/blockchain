const Blockchain = require('./index');
const Block = require('./block');

describe('Pruebas para la clase Blockchain', () => {

    let bc = new Blockchain();
    let bc2 = new Blockchain();

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('Debe inciar con un bloque de tipo genesis', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('Debe agregar un nuevo bloque', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    it('Debe validar la cadena y debe ser válida', () => {

        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('Debe invalidar la cadena con un genesis corrupto', () => {
        bc2.chain[0].data = 'Datos modificados en el genesis';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('Debe invalidar la cadena ccorrupta', () => {

        bc2.addBlock('foo');
        bc2.chain[bc2.chain.length-1].data = 'No es Foo';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });
    
    it('Debe reemplazar la cadena con una cadena válida', () => {

        bc.addBlock('Goo');
        bc2.replaceChain(bc.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });

       
    it('Debe invalidar el intento de reemplazo de la cadena con una cadena más pequeña o igual a la actual.', () => {

        bc.addBlock('Goo');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });
})
