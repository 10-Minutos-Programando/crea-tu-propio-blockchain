const SHA256 = require('crypto-js/sha256')

class Block{

    constructor(index, timestamp, data, previousHash = ''){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join('0')){
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log('Block mined: ' + this.hash)
    }

}

class BlockChain{
    
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 5
    }

    createGenesisBlock(){
        return new Block(0, '01/01/2018', 'Genesis Block', '0')
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i-1]

            // El hash del bloque no es válido
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false
            }

            // Comprobamos si apunta al anterior
            if (currentBlock.previousHash !== previousBlock.hash){
                return false
            }
        }
        return true
    }

}

let marioCoin = new BlockChain()

console.log('Minando Bloque 1...')
marioCoin.addBlock(new Block(1, "10/09/2018", { amount: 4 }))

console.log('Minando Bloque 2...')
marioCoin.addBlock(new Block(2, "12/09/2018", { amount: 20 }))

// console.log(marioCoin.isChainValid())

// marioCoin.chain[1].data = { amount: 100 }
// marioCoin.chain[1].hash = marioCoin.chain[1].calculateHash()

// console.log(marioCoin.isChainValid())

// console.log(JSON.stringify(marioCoin, null, 4))

