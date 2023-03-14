const constant = require("./constant");
const { BigQuery } = require("@google-cloud/bigquery");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: constant.project_id,
  credentials: constant.bq_key,
});

const bigquery = new BigQuery({
  credentials: constant.bq_key,
  projectId: constant.project_id,
});

async function getListFiles() {
  const options = {
    deilimiter: "/",
  };

  const [files] = await storage.bucket(constant.bucket_name).getFiles(options);

  return files
    .filter((elem) => {
      return elem.name.split("/")[1] !== "";
    })
    .map((elem) => elem.name.split("/"));
}

async function loadJSONFromGCSAutodetect() {
  const d = await getListFiles();

  for (let i = 0; i < d.length; i++) {
    let metadata = {
      sourceFormat: "NEWLINE_DELIMITED_JSON",
      schema: constant.table_schema[d[i][0]],
    };

    const [job] = await bigquery
      .dataset(constant.dataset_id)
      .table(d[i][0])
      .load(
        storage.bucket(constant.bucket_name).file(d[i][0] + "/" + d[i][1]),
        metadata
      );
    console.log(`Job ${job.id} completed.`);

    await storage
      .bucket(constant.bucket_name)
      .file(d[i][0] + "/" + d[i][1])
      .delete();
  }
}

loadJSONFromGCSAutodetect();
