require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.3",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337, // Chain ID fix for Metamask
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_KEY}`,
      accounts: [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
      gas: 60000,
    },
  },
};
