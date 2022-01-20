const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config')
class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timeStamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    toString() {
        return `Block -
        TimeStamp   : ${this.timeStamp}
        LastHash    : ${this.lastHash.substring(0, 10)}
        Hash        : ${this.hash.substring(0, 10)}
        Data        : ${this.data}
        Nonce       : ${this.nonce}
        Difficulty  : ${this.difficulty}`;
    }
    static genesis() {
        return new this('Genesis time', '------', '4LuC4rD2022', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        let hash, timeStamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timeStamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timeStamp);
            hash = Block.hash(timeStamp, lastHash, data, nonce, difficulty);

        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this(timeStamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, noce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${noce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timeStamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timeStamp, lastHash, data, nonce, difficulty);
    }
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timeStamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;