const SHA256 = require('crypto-js/sha256')

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block{

    constructor(timestamp, transactions, previousHash = ''){        
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
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
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 100
    }

    createGenesisBlock(){
        return new Block('01/01/2018', 'Genesis Block', '0')
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions)
        block.previousHash = this.getLatestBlock().hash
        block.mineBlock(this.difficulty)

        console.log('Block successfully mined')
        this.chain.push(block)

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address){
        let balance = 0
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                }

                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }
        return balance
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

marioCoin.createTransaction(new Transaction('address1', 'address2', 100))
marioCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\nComienza el minado')
marioCoin.minePendingTransactions('mario-address')

console.log('Balance of Mario is ', marioCoin.getBalanceOfAddress('mario-address'))

console.log('\nComienza el minado')
marioCoin.minePendingTransactions('mario-address')

console.log('Balance of Mario is ', marioCoin.getBalanceOfAddress('mario-address'))


// console.log('Minando Bloque 1...')
// marioCoin.addBlock(new Block(1, "10/09/2018", { amount: 4 }))

// console.log('Minando Bloque 2...')
// marioCoin.addBlock(new Block(2, "12/09/2018", { amount: 20 }))

// console.log(marioCoin.isChainValid())

// marioCoin.chain[1].data = { amount: 100 }
// marioCoin.chain[1].hash = marioCoin.chain[1].calculateHash()

// console.log(marioCoin.isChainValid())

console.log(JSON.stringify(marioCoin, null, 4))

