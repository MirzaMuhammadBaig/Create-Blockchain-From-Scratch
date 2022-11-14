const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 2;

const GENESIS_DATA = {
    timestamp: 1,
    prevHash: '0x0000',
    hash: '0x1234',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
};

module.exports = { GENESIS_DATA, MINE_RATE };