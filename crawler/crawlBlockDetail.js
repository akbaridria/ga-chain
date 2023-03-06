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
  for (let i = start_num; i <= end_num; i++) temp.push([i]);
  return temp;
}

// extract blocks
async function extractBlockDetails(start_block, end_block) {
  let temp = [];

  const d = await fetchRpc(
    pushMethod(getListBlock(start_block, end_block), "zks_getBlockDetails")
  );

  for (let i = 0; i < d.length; i++) {
    if (d[i].result && d[i].result.status === "verified") {
      temp.push({
        timestamp: d[i].result.timestamp,
        block_number: d[i].result.number,
        status: d[i].result.status,
        commit_tx_hash: d[i].result.commitTxHash,
        committed_at: d[i].result.committedAt,
        execute_tx_hash: d[i].result.executeTxHash,
        executed_at: d[i].result.executedAt,
        l1_tx_count: d[i].result.l1TxCount,
        l2_tx_count: d[i].result.l2TxCount,
        prove_tx_hash: d[i].result.proveTxHash,
        proven_at: d[i].result.provenAt,
        root_hash: d[i].result.rootHash,
      });
    }
  }
  return {
    blockDetail: temp,
  };
}

// main function
async function mainFunction() {
  const d = await bq.runQuery(bq.queryDetailBlock());
  const e = await bq.runQuery(bq.queryCountBN());
  const start_numb = d && d.length > 0 ? d[0].block_number + 1 : 1;
  const end_numb = e[0].block_number;
  const f = await extractBlockDetails(start_numb, end_numb);
  if (f.blockDetail.length > 0)
    await helper.saveToStorage(
      new Buffer.from(f.blockDetail.map(JSON.stringify).join("\n")),
      "block_details"
    );
}

mainFunction();
