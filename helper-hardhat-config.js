const networkConfig = {
    31337: {
        name: "localhost",
    },

    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // https://docs.chain.link/data-feeds/price-feeds/addresses
    },

    80001: {
        name: "mumbai",
        ethUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    },
};

const INITIAL_SUPPLY = "1000000000000000000000";

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    networkConfig,
    developmentChains,
    INITIAL_SUPPLY,
};
