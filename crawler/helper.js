module.exports = Object.freeze({
  rpc_url: 'https://zksync2-mainnet.zksync.io',
  project_id : 'ga-chain',
  dataset_id : 'zkSync_era_mainnet',
  tables: {
    transactions: 'transactions',
    log_events: 'log_events',
    blocks: 'blocks'
  },
  bq_key: require('./all-user-key.json')
});