const { BigQuery } = require("@google-cloud/bigquery");
const key = require("./all-user-key.json");
const project_id = "ga-chain";

// create connection
const connectToBQ = () => {
  const bigqueryClient = new BigQuery({
    credentials: key,
    projectId: project_id,
  });
  return bigqueryClient;
};

const runQuery = async (query) => {
  const bigquery = await connectToBQ();
  const [job] = await bigquery.createQueryJob(query);
  const [rows] = await job.getQueryResults();
  return rows;
};

module.exports = {
  runQuery,
};
