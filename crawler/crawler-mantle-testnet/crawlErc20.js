const constant = require("./constant");
const fetch = require("node-fetch");
const BigNumber = require("bignumber.js");
const helper = require("./helper");
const bq = require("./bq");
const ethers = require("ethers");
const abi = require("./erc20.abi.json");

const provider = new ethers.providers.JsonRpcProvider(constant.rpc_url);

async function extractContracts(listTx) {
  let tempToken = [];
  for (let i = 0; i < listTx.length; i++) {
    if (listTx[i].contract_address) {
      const contract = new ethers.Contract(
        listTx[i].contract_address,
        abi,
        provider
      );
      try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        console.log(name, symbol, decimals);
        tempToken.push({
          contract_address: listTx[i].contract_address,
          name: name,
          symbol: symbol,
          decimals: decimals,
          is_erc20: true,
        });
      } catch (error) {
        tempToken.push({
          contract_address: listTx[i].contract_address,
          name: null,
          symbol: null,
          decimals: null,
          is_erc20: false,
        });
      }
    }
  }
  return tempToken;
}

async function mainFunction() {
  const d = await bq.runQuery(bq.queryContractAddress());
  console.log(d);
  const h = await extractContracts(d);
  console.log(h);
  if (h.length > 0)
    await helper.saveToStorage(
      new Buffer.from(h.map(JSON.stringify).join("\n")),
      "contracts"
    );
}

mainFunction();
