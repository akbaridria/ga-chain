const constanct = require('./helper')
const bq = require('./bq')
const zksync = require("zksync-web3");
const BigNumber = require('bignumber.js');
const zkSyncProvider = new zksync.Provider(constanct.rpc_url);

let blocks = []
let transactions = []
let log_events = []

// get block detail
async function getBlockDetail(block){
  const d = await zkSyncProvider.getBlockDetails(block)
  return d
}

// get block
async function getBlock(block) {
  const d = await zkSyncProvider.getBlock(block)
  return d
}

// get tx
async function getTransaction(tx) {
  const d = await zkSyncProvider.getTransaction(tx)
  return d
}

// get tx receipt
async function getTransactionReceipt(tx) {
  const d = await zkSyncProvider.getTransactionReceipt(tx)
  return d
}

// main function
async function mainFunction(){
  // checking latest block indexed
  const block = await bq.runQuery(bq.queryBlock())
  let start_block = block.length > 0 ? (new BigNumber(block[0].block_number)).toNumber() + 1 : 1
  const blockDetail = await getBlockDetail(start_block)

  // checking if it is verified. only index blocks that has been verified
  if(blockDetail && blockDetail.status === 'verified') {
    let blockTemp = {
      timestamp: blockDetail.timestamp,
      block_number: blockDetail.number,
      status: blockDetail.status,
      commit_tx_hash: blockDetail.commitTxHash,
      committed_at: blockDetail.committedAt,
      execute_tx_hash: blockDetail.executeTxHash,
      executed_at: blockDetail.executedAt,
      l1_tx_count: blockDetail.l1TxCount,
      l2_tx_count: blockDetail.l2TxCount,
      proven_tx_hash: blockDetail.proveTxHash,
      proven_at: blockDetail.provenAt,
      root_hash: blockDetail.rootHash
    }
    blocks.push(blockTemp)
    const listBlock = await getBlock(start_block)
    const listTransactions = listBlock.transactions

    for(let elem of listTransactions) {
      const tx = await getTransaction(elem);
      const txReceipt = await getTransactionReceipt(elem)
      let txTemp = {
        timestamp: blockTemp.timestamp,
        block_number: tx.blockNumber,
        tx_hash: tx.hash,
        type: tx.type,
        block_hash: tx.blockHash,
        from_address: tx.from,
        to_address: tx.to,
        contract_address: txReceipt.contractAddress,
        value: tx.value,
        data: tx.data,
        gas_used: txReceipt.gasUsed,
        gas_limit: tx.gasLimit,
        gas_price: tx.gasPrice,
        nonce: tx.nonce,
        chain_id: tx.chainId,
        status: txReceipt.status,
        transaction_index: tx.transactionIndex
      }
      transactions.push(txTemp)
      for(let element of txReceipt.logs) {
        let logTemp = {
          timestamp: blockTemp.timestamp,
          tx_hash: tx.hash,
          block_number: tx.blockNumber,
          block_hash: tx.blockHash,
          transaction_index: element.transactionIndex,
          address: element.address,
          topics: element.topics,
          data: element.data,
          log_index: element.logIndex
        }
        log_events.push(logTemp)
      }
    }
    if(blocks.length > 0) await bq.runQuery(bq.insertBlocks(blocks))
    if(transactions.length > 0) await bq.runQuery(bq.insertTx(transactions))
    if(log_events.length > 0) await bq.runQuery(bq.insertLogs(log_events))
    console.log('done')
  }
}
mainFunction()