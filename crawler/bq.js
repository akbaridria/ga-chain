const {BigQuery} = require('@google-cloud/bigquery');
const constant = require('./helper')


// create connection
const connectToBQ = () => {
  const bigqueryClient = new BigQuery({credentials: constant.bq_key, projectId:constant.project_id});
  return bigqueryClient
}

// query select blocks
const queryBlock = () => {
  const query = `SELECT block_number FROM \`${constant.project_id}.${constant.dataset_id}.${constant.tables.blocks}\` order by block_number desc limit 1`
  return query
}

// insert blocks
const insertBlocks = (data) => {
  let query = `INSERT INTO \`${constant.project_id}.${constant.dataset_id}.${constant.tables.blocks}\` VALUES`
  for(let i = 0; i < data.length; i++) {
    query += `(${data[i].timestamp}, ${data[i].block_number}, '${data[i].status}', '${data[i].commit_tx_hash}', '${data[i].committed_at}', '${data[i].execute_tx_hash}', '${data[i].executed_at}', ${data[i].l1_tx_count}, ${data[i].l2_tx_count}, '${data[i].proven_tx_hash}', '${data[i].proven_at}', '${data[i].root_hash}')`
    if(i + 1 === data.length) {
      query += ';' 
    } else query += ',' 
  }
  return query
}

// insert transactions
const insertTx = (data) => {
  let query = `INSERT INTO \`${constant.project_id}.${constant.dataset_id}.${constant.tables.transactions}\` VALUES`
  for(let i = 0; i < data.length; i++) {
    query += `(${data[i].timestamp}, ${data[i].block_number}, '${data[i].tx_hash}', ${data[i].type}, '${data[i].block_hash}', '${data[i].from_address}', '${data[i].to_address}', '${data[i].contract_address}', ${data[i].value}, '${data[i].data}', ${data[i].gas_used}, ${data[i].gas_limit}, ${data[i].gas_price}, ${data[i].nonce}, ${data[i].chain_id}, ${data[i].status}, ${data[i].transaction_index})`
    if(i + 1 === data.length) {
      query += ';' 
    } else query += ',' 
  }
  return query
}

// insert transactions
const insertLogs = (data) => {
  let query = `INSERT INTO \`${constant.project_id}.${constant.dataset_id}.${constant.tables.log_events}\` VALUES`
  for(let i = 0; i < data.length; i++) {
    query += `(${data[i].timestamp}, '${data[i].tx_hash}', ${data[i].block_number}, '${data[i].block_hash}', ${data[i].transaction_index}, '${data[i].address}', ${JSON.stringify(data[i].topics)}, '${data[i].data}', ${data[i].log_index})`
    if(i + 1 === data.length) {
      query += ';' 
    } else query += ',' 
  }
  return query
}

// run query
const runQuery = async (query) => {
  const bigquery = await connectToBQ()
  const [job] = await bigquery.createQueryJob(query);
  const [rows] = await job.getQueryResults();
  return rows
}

module.exports = {
  connectToBQ,
  queryBlock,
  runQuery,
  insertBlocks,
  insertTx,
  insertLogs
}
