const { Storage } = require("@google-cloud/storage");
const { BigQuery } = require("@google-cloud/bigquery");
const constant = require("./constant");

// initiate storage and bigquery
const storage = new Storage({
  projectId: constant.project_id,
  credentials: constant.bq_key,
});

const bigqueryClient = new BigQuery({
  credentials: constant.bq_key,
  projectId: constant.project_id,
});

// convert to csv
function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      if (typeof Object.values(it) === "object") {
        return JSON.stringify(Object.values(it));
      }
      return Object.values(it).toString();
    })
    .join("\n");
}

// save to google storage
async function saveToStorage(data, sub_folder) {
  const myBucket = storage.bucket(constant.bucket_name);
  const file = myBucket.file(sub_folder + "/" + Date.now() + ".json");
  const contents = data;

  await file.save(contents).then(() => console.log("done"));
}

module.exports = {
  saveToStorage,
  convertToCSV,
};
