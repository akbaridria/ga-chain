const { BigQuery } = require("@google-cloud/bigquery");
const key = require("./all-user-key.json");
const keyGC = require("./ga-chain-key.json");
const project_id = "ga-chain";
const project_admin = "admin-ga-chain";
// create connection
const connectToBQ = () => {
  const bigqueryClient = new BigQuery({
    credentials: key,
    projectId: project_id,
  });
  return bigqueryClient;
};

const connectToBQGC = () => {
  const bigqueryClient = new BigQuery({
    credentials: keyGC,
    projectId: project_admin,
  });
  return bigqueryClient;
};

const checkUser = (email) => {
  const query = `SELECT * FROM ${project_admin}.user_ga_chain.user WHERE email = '${email}'`;
  return query;
};

const checkToken = (token) => {
  const query = `SELECT * FROM ${project_admin}.user_ga_chain.user WHERE token = '${token}'`;
  return query;
};

const updateUser = (email, access_token) => {
  const query = `UPDATE ${project_admin}.user_ga_chain.user SET access_token = '${access_token}' WHERE email = '${email}'`;
  return query;
};

const insertUser = (register_at, email, token, access_token) => {
  const query = `INSERT INTO ${project_admin}.user_ga_chain.user VALUES(TIMESTAMP_SECONDS(${register_at}), '${email}', '${token}', '${access_token}')`;
  return query;
};

const runQuery = async (query) => {
  const bigquery = await connectToBQ();
  const [job] = await bigquery.createQueryJob(query);
  const [rows] = await job.getQueryResults();
  return rows;
};

const runQueryGC = async (query) => {
  const bigquery = await connectToBQGC();
  const [job] = await bigquery.createQueryJob(query);
  const [rows] = await job.getQueryResults();
  return rows;
};

module.exports = {
  runQuery,
  checkUser,
  insertUser,
  runQueryGC,
  updateUser,
  checkToken,
};
