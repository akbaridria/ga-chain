import dedent from "dedent";

export const defaultCode = dedent(`SELECT
CAST(DATE(TIMESTAMP_SECONDS(timestamp)) AS STRING) as date,
count(distinct from_address) as total
FROM
\`ga-chain.zkSync_era_mainnet.transactions\`
group by 1
order by 1`);

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

export const downloadCsv = async (items) => {
  const csv = convertToCSV(items);
  let link = document.createElement("a");
  link.id = "download-csv";
  link.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(csv)
  );
  link.setAttribute("download", "result-query-ga-chain.csv");
  document.body.appendChild(link);
  document.querySelector("#download-csv").click();
};
