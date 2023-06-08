require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-solhint");
require("hardhat-contract-sizer");
require("dotenv").config();

// Ethereum and polygon mainnet RPC_URL
const ETHEREUM_MAINNET_RPC_URL = process.env.ETHEREUM_MAINNET_RPC_URL;
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL;

// Etherscan and Polygonscan testnet RPC_URL
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;

// Etherscan, Polygonscan and CoinmarketCap API keys
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

// Private Key
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// If this expression is true, then the value of REPORT_GAS will be set to true. Otherwise, the value of REPORT_GAS will be set to false.
const REPORT_GAS = process.env.REPORT_GAS.toLowerCase() === "true" || false;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",

    networks: {
        hardhat: {
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // },
            chainId: 31337,
        },

        localhost: {
            url: "http:/127.0.0.1:8545/",
            chainId: 31337,
        },

        sepolia: {
            url: SEPOLIA_RPC_URL,
            chainId: 11155111,
            accounts: [PRIVATE_KEY],
            blockConfirmation: 6,
            // saveDeployments: true,
            //accounts: {
            //     mnemonic: MNEMONIC,
            // },
        },

        mumbai: {
            url: MUMBAI_RPC_URL,
            chainId: 80001,
            accounts: [PRIVATE_KEY],
            blockConfirmation: 6,
        },

        mainnet: {
            url: ETHEREUM_MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 1,
        },

        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 137,
        },
    },

    etherscan: {
        // yarn hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
        },
    },

    gasReporter: {
        enabled: REPORT_GAS,
        outputFile: "gas-report.txt",
        currency: "USD",
        token: "ETH",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },

    contractSizer: {
        runOnCompile: false,
        only: ["OurToken"],
    },

    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        user1: {
            default: 1,
        },
    },

    solidity: {
        compilers: [
            {
                version: "0.8.18",
            },
            {
                version: "0.4.24",
            },
        ],
    },

    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
};
