const Block = require('./block');

describe('Pruebas para la clase Block', () => {
    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);;
    });
    it('Debe setear la `data` y que coincida con la entrada', () => {
        expect(block.data).toEqual(data);
    });

    it('Debe setear el `lastHash` y que coincida con el hash del ultimo bloque', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
})
