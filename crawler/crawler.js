const constant = require("./constant");
const fetch = require("node-fetch");
const BigNumber = require("bignumber.js");
const helper = require("./helper");
const bq = require("./bq");

// total block index per crawling
const blockPerCrawl = 10;

// convert number to hex
function convertNumberToHex(numb) {
  return BigNumber(numb).toString(16);
}

function convertHexToNumber(hex) {
  return BigNumber(hex).toNumber();
}

// method json rpc
function methodRPC(method_name, params) {
  return {
    method: method_name,
    params: params,
    id: 1,
    jsonrpc: "2.0",
  };
}

// fetch RPC
async function fetchRpc(params) {
  const r = await fetch(constant.rpc_url, {
    body: JSON.stringify(params),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return await r.json();
}

// push req rpc method to batch request
function pushMethod(list_params, method_name) {
  let temp = [];
  for (let i = 0; i < list_params.length; i++) {
    temp.push(methodRPC(method_name, list_params[i]));
  }
  return temp;
}

// get list block number from start and end number
function getListBlock(start_num, end_num) {
  let temp = [];
  for (let i = start_num; i <= end_num; i++)
    temp.push(["0x" + convertNumberToHex(i), true]);
  return temp;
}

// extract blocks
async function extractBlocks(start_block, end_block) {
  let temp = [];
  let tempTx = [];

  const d = await fetchRpc(
    pushMethod(getListBlock(start_block, end_block), "eth_getBlockByNumber")
  );
  for (let i = 0; i < d.length; i++) {
    if (d[i].result) {
      temp.push({
        timestamp: convertHexToNumber(d[i].result.timestamp),
        block_number: convertHexToNumber(d[i].result.number),
        parent_hash: d[i].result.parentHash,
        block_hash: d[i].result.hash,
        miner: d[i].result.miner,
        total_transactions: d[i].result.transactions.length,
        gas_limit: convertHexToNumber(d[i].result.gasLimit),
        gas_used: convertHexToNumber(d[i].result.gasUsed),
        receipt_root: d[i].result.receiptsRoot,
        sha3_uncles: d[i].result.sha3Uncles,
        transaction_root: d[i].result.transactionsRoot,
        log_blooms: d[i].result.logsBloom,
      });
      if (d[i].result.transactions.length > 0)
        for (let k = 0; k < d[i].result.transactions.length; k++) {
          tempTx.push({
            tx: d[i].result.transactions[k],
            timestamp: convertHexToNumber(d[i].result.timestamp),
          });
        }
    }
  }
  return {
    extractBlocks: temp,
    listTx: tempTx,
  };
}

async function extractTransactionAndLogs(listTx) {
  let tempTx = [];
  let tempLogs = [];
  let tempMethod = [];
  if (listTx.length > 0) {
    for (let i = 0; i < listTx.length; i++) {
      tempMethod.push([listTx[i].tx.hash]);
    }

    const listReceipt = await fetchRpc(
      pushMethod(tempMethod, "eth_getTransactionReceipt")
    );
    for (let j = 0; j < listReceipt.length; j++) {
      tempTx.push({
        timestamp: listTx[j].timestamp,
        block_number: convertHexToNumber(listTx[j].tx.blockNumber),
        tx_hash: listTx[j].tx.hash,
        type: convertHexToNumber(listTx[j].tx.type),
        block_hash: listTx[j].tx.blockHash,
        from_address: listTx[j].tx.from,
        to_address: listTx[j].tx.to,
        contract_address: listReceipt[j].result.contractAddress,
        value: convertHexToNumber(listTx[j].tx.value),
        data: listTx[j].tx.input,
        gas_used: convertHexToNumber(listReceipt[j].result.gasUsed),
        gas_price: convertHexToNumber(listTx[j].tx.gasPrice),
        nonce: convertHexToNumber(listTx[j].tx.nonce),
        chain_id: convertHexToNumber(listTx[j].tx.chainId),
        status: convertHexToNumber(listReceipt[j].result.status),
        transaction_index: convertHexToNumber(listTx[j].tx.transactionIndex),
      });

      if (listReceipt[j].result.logs.length > 0)
        for (let k = 0; k < listReceipt[j].result.logs.length; k++) {
          tempLogs.push({
            timestamp: listTx[j].timestamp,
            tx_hash: listReceipt[j].result.logs[k].transactionHash,
            block_number: convertHexToNumber(
              listReceipt[j].result.logs[k].blockNumber
            ),
            block_hash: listReceipt[j].result.logs[k].blockHash,
            transaction_index: convertHexToNumber(
              listReceipt[j].result.logs[k].transactionIndex
            ),
            address: listReceipt[j].result.logs[k].address,
            topics: listReceipt[j].result.logs[k].topics,
            data: listReceipt[j].result.logs[k].data,
            log_index: convertHexToNumber(
              listReceipt[j].result.logs[k].transactionLogIndex
            ),
          });
        }
    }
  }

  return {
    extractTx: tempTx,
    extractLogs: tempLogs,
  };
}

// main function
async function mainFunction() {
  // get latest block indexed
  const lastBlock = await bq.runQuery(bq.queryBlock());
  const start_block =
    lastBlock.length > 0
      ? new BigNumber(lastBlock[0].block_number).toNumber() + 1
      : 1;
  const end_block = start_block + blockPerCrawl;

  // extract data
  const d = await extractBlocks(start_block, end_block);
  const e = await extractTransactionAndLogs(d.listTx);

  // insert to google storage
  if (d.extractBlocks.length > 0)
    await helper.saveToStorage(
      new Buffer.from(d.extractBlocks.map(JSON.stringify).join("\n")),
      "blocks"
    );
  if (e.extractTx.length > 0)
    await helper.saveToStorage(
      new Buffer.from(e.extractTx.map(JSON.stringify).join("\n")),
      "transactions"
    );
  if (e.extractLogs.length > 0)
    await helper.saveToStorage(
      new Buffer.from(e.extractLogs.map(JSON.stringify).join("\n")),
      "log_events"
    );
}

mainFunction();
