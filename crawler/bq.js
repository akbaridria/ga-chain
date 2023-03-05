const {BigQuery} = require('@google-cloud/bigquery');
const constant = require("./constant");


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
};
