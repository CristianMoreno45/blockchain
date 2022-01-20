const Block = require('./block');
const { DIFFICULTY } = require('../config')

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
    it('Debe tener un hash que cumpla con la dificultad establecida', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());

    });
    it('Debe bajar la difficultad porque está minando lento', () => {
        expect(Block.adjustDifficulty(block, block.timeStamp + 36000))
        .toEqual(block.difficulty - 1);
    });

    it('Debe subir la difficultad porque está minando rapido', () => {
        expect(Block.adjustDifficulty(block, block.timeStamp +1))
        .toEqual(block.difficulty + 1);
    });
})
