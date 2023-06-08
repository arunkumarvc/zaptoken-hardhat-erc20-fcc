const { network } = require("hardhat");
const {
    developmentChains,
    INITIAL_SUPPLY,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments; // from hre
    const { deployer } = await getNamedAccounts(); // namedAccounts.deployer, from hardhat.config.js
    const zapToken = await deploy("ZapToken", {
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1, // we need to wait if on a live network so we can verify properly
    });

    log(`zapToken deployed at ${zapToken.address}`);

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(zapToken.address, [INITIAL_SUPPLY.toString()]);
    }
};

module.exports.tags = ["all", "token"];
