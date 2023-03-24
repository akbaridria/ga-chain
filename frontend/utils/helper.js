import { saveAs } from "file-saver";

export const defaultCode = `-- count unique addresses per day
SELECT
  CAST(DATE(TIMESTAMP_SECONDS(timestamp)) AS STRING) as date,
  count(distinct from_address) as total
FROM
  \`ga-chain.mantle_testnet.transactions\`
group by 1
order by 1`;

function convertToCSV(data) {
  let csv = "";
  let header = Object.keys(data[0]).join(",");
  let values = data.map((o) => Object.values(o).join(",")).join("\n");

  csv += header + "\n" + values;
  return csv;
}

export const downloadCsv = async (items) => {
  const csv = await convertToCSV(items);
  let file = new File([csv], "ga-chain-result.csv", {
    type: "text/csv;charset=utf-8",
  });
  await saveAs(file);
};

export const table_schema = {
  block_details: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "block_number", type: "INTEGER" },
      { name: "status", type: "STRING" },
      { name: "commit_tx_hash", type: "STRING" },
      { name: "committed_at", type: "TIMESTAMP" },
      { name: "execute_tx_hash", type: "STRING" },
      { name: "executed_at", type: "TIMESTAMP" },
      { name: "l1_tx_count", type: "INTEGER" },
      { name: "l2_tx_count", type: "INTEGER" },
      { name: "prove_tx_hash", type: "STRING" },
      { name: "proven_at", type: "TIMESTAMP" },
      { name: "root_hash", type: "STRING" },
    ],
  },
  transactions: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "block_number", type: "INTEGER" },
      { name: "tx_hash", type: "STRING" },
      { name: "type", type: "INTEGER" },
      { name: "block_hash", type: "STRING" },
      { name: "from_address", type: "STRING" },
      { name: "to_address", type: "STRING" },
      { name: "contract_address", type: "STRING" },
      { name: "value", type: "NUMERIC" },
      { name: "data", type: "STRING" },
      { name: "gas_used", type: "NUMERIC" },
      { name: "gas_price", type: "NUMERIC" },
      { name: "nonce", type: "INTEGER" },
      { name: "chain_id", type: "INTEGER" },
      { name: "status", type: "INTEGER" },
      { name: "transaction_index", type: "INTEGER" },
    ],
  },
  blocks: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "block_number", type: "INTEGER" },
      { name: "parent_hash", type: "STRING" },
      { name: "block_hash", type: "STRING" },
      { name: "miner", type: "STRING" },
      { name: "total_transactions", type: "INTEGER" },
      { name: "gas_limit", type: "NUMERIC" },
      { name: "gas_used", type: "NUMERIC" },
      { name: "receipt_root", type: "STRING" },
      { name: "sha3_uncles", type: "STRING" },
      { name: "transaction_root", type: "STRING" },
      { name: "log_blooms", type: "STRING" },
    ],
  },
  log_events: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "tx_hash", type: "STRING" },
      { name: "block_number", type: "INTEGER" },
      { name: "block_hash", type: "STRING" },
      { name: "transaction_index", type: "INTEGER" },
      { name: "address", type: "STRING" },
      { name: "topics", type: "STRING", mode: "REPEATED" },
      { name: "data", type: "STRING" },
      { name: "log_index", type: "INTEGER" },
    ],
  },
};

export const table_schema_mantle_testnet = {
  transactions: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "block_number", type: "INTEGER" },
      { name: "tx_hash", type: "STRING" },
      { name: "block_hash", type: "STRING" },
      { name: "from_address", type: "STRING" },
      { name: "to_address", type: "STRING" },
      { name: "contract_address", type: "STRING" },
      { name: "value", type: "NUMERIC" },
      { name: "data", type: "STRING" },
      { name: "gas_used", type: "NUMERIC" },
      { name: "gas_price", type: "NUMERIC" },
      { name: "nonce", type: "INTEGER" },
      { name: "status", type: "INTEGER" },
      { name: "transaction_index", type: "INTEGER" },
    ],
  },
  blocks: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "block_number", type: "INTEGER" },
      { name: "parent_hash", type: "STRING" },
      { name: "block_hash", type: "STRING" },
      { name: "miner", type: "STRING" },
      { name: "total_transactions", type: "INTEGER" },
      { name: "gas_limit", type: "NUMERIC" },
      { name: "gas_used", type: "NUMERIC" },
      { name: "receipt_root", type: "STRING" },
      { name: "sha3_uncles", type: "STRING" },
      { name: "transaction_root", type: "STRING" },
      { name: "log_blooms", type: "STRING" },
    ],
  },
  log_events: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "tx_hash", type: "STRING" },
      { name: "block_number", type: "INTEGER" },
      { name: "block_hash", type: "STRING" },
      { name: "transaction_index", type: "INTEGER" },
      { name: "address", type: "STRING" },
      { name: "topics", type: "STRING", mode: "REPEATED" },
      { name: "data", type: "STRING" },
      { name: "log_index", type: "INTEGER" },
    ],
  },
  token_transfers: {
    fields: [
      { name: "timestamp", type: "INTEGER" },
      { name: "block_number", type: "INTEGER" },
      { name: "tx_hash", type: "STRING" },
      { name: "block_hash", type: "STRING" },
      { name: "token_address", type: "STRING" },
      { name: "from_address", type: "STRING" },
      { name: "to_address", type: "STRING" },
      { name: "value", type: "BIGNUMERIC" },
      { name: "transaction_index", type: "INTEGER" },
      { name: "log_index", type: "INTEGER" },
    ],
  },
  contracts: {
    fields: [
      { name: "contract_address", type: "STRING" },
      { name: "name", type: "STRING" },
      { name: "symbol", type: "STRING" },
      { name: "decimals", type: "INTEGER" },
      { name: "is_erc20", type: "BOOLEAN" },
    ],
  },
  mantleswap_pools: {
    fields: [
      { name: "created_at", type: "STRING" },
      { name: "created_at_block", type: "INTEGER" },
      { name: "creted_at_time", type: "INTEGER" },
      { name: "pair_address", type: "STRING" },
      { name: "pair_name", type: "STRING" },
      { name: "token0_address", type: "STRING" },
      { name: "token0_name", type: "STRING" },
      { name: "token0_decimals", type: "INTEGER" },
      { name: "token1_address", type: "STRING" },
      { name: "token1_name", type: "STRING" },
      { name: "token1_decimals", type: "INTEGER" },
    ],
  },
  mantleswap_swaps: {
    fields: [
      { name: "tx_hash", type: "STRING" },
      { name: "block_number", type: "INTEGER" },
      { name: "timestamp", type: "INTEGER" },
      { name: "initiator_tx", type: "STRING" },
      { name: "swap_from", type: "STRING" },
      { name: "swap_from_amount_raw", type: "BIGNUMERIC" },
      { name: "swap_from_amount", type: "FLOAT" },
      { name: "swap_to", type: "STRING" },
      { name: "swap_to_amount_raw", type: "BIGNUMERIC" },
      { name: "swap_to_amount", type: "FLOAT" },
      { name: "log_index", type: "STRING" },
    ],
  },
  mantleswap_liquidity_action: {
    fields: [
      { name: "tx_hash", type: "STRING" },
      { name: "block_number", type: "INTEGER" },
      { name: "timestamp", type: "INTEGER" },
      { name: "liquidity_provider", type: "STRING" },
      { name: "action", type: "STRING" },
      { name: "token0", type: "STRING" },
      { name: "token1", type: "STRING" },
      { name: "token0_raw_amount", type: "FLOAT" },
      { name: "token1_raw_amount", type: "FLOAT" },
      { name: "token0_amount", type: "FLOAT" },
      { name: "token1_amount", type: "FLOAT" },
      { name: "token0_name", type: "STRING" },
      { name: "token1_name", type: "STRING" },
    ],
  },
};