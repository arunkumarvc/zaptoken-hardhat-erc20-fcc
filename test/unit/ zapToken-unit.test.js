const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
    developmentChains,
    INITIAL_SUPPLY,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ZapToken Unit Test", function () {
          const multiplier = 10 ** 18;
          let zapToken, deployer, user1;
          beforeEach(async function () {
              const accounts = await getNamedAccounts();
              deployer = accounts.deployer;
              user1 = accounts.user1;

              // deployments objects has a function called fixture. fixture allows us to run our entire deploy folder with as many tags(module.exports.tags) as we want.
              // fixture  will run through our deploy scripts on our local network and deploy all of the contracts, that we can use them in our scripts and in our testing. we can deploy everything in our deploy folder with just this line
              // In Hardhat, fixtures are used to set up the state of the blockchain for testing purposes. This means that you don't have to deploy contracts and add initial funds to them every time you want to run a test. This can save you a lot of time and effort.
              await deployments.fixture("all");
              zapToken = await ethers.getContract("ZapToken", deployer);
          });

          it("was deployed", async () => {
              assert(zapToken.address);
          });

          describe("constructor", () => {
              it("Should have correct INITIAL_SUPPLY of token", async () => {
                  const totalSupply = await zapToken.totalSupply();
                  assert.equal(totalSupply.toString(), INITIAL_SUPPLY);
              });

              it("initializes the token with the correct name and symbol", async () => {
                  const name = await zapToken.name();
                  assert.equal(name, "ZapToken");

                  const symbol = await zapToken.symbol();
                  assert.equal(symbol, "ZAP");
              });
          });

          describe("transfers", () => {
              it("Should be able to transfer tokens successfully to an address", async () => {
                  const tokensToSend = ethers.utils.parseEther("10");
                  await zapToken.transfer(user1, tokensToSend);
                  expect(await zapToken.balanceOf(user1)).to.equal(
                      tokensToSend
                  );
              });

              it("emits an transfer event, when an transfer occurs", async () => {
                  await expect(
                      zapToken.transfer(user1, (10 * multiplier).toString())
                  ).to.emit(zapToken, "Transfer");
              });
          });

          describe("allowances", () => {
              const amount = (20 * multiplier).toString();
              beforeEach(async () => {
                  // It will get the recently deployed contract, whenever we call a function with playerToken, it'll automatically be from the user1 account
                  playerToken = await ethers.getContract("ZapToken", user1);
              });
              it("Should approve other address to spend token", async () => {
                  const tokensToSpend = ethers.utils.parseEther("5");
                  // Deployer is approving that user1 can spend 5 of their ZAP token
                  // await deployer.approve(_spender, _value)
                  // await deployer.approve(user1, 5ETH)
                  await zapToken.approve(user1, tokensToSpend);
                  // await user1.transferFrom(_from, _to, _value )
                  // await user1.transferFrom(deployer, user1, 5ETH )
                  await playerToken.transferFrom(
                      deployer,
                      user1,
                      tokensToSpend
                  );
                  expect(await playerToken.balanceOf(user1)).to.equal(
                      tokensToSpend
                  );
              });

              it("doesn't allow an unapproved member to do transfers", async () => {
                  await expect(
                      playerToken.transferFrom(deployer, user1, amount)
                  ).to.be.revertedWith("ERC20: insufficient allowance");
              });

              it("emits an approval event, when an approval occurs", async () => {
                  await expect(zapToken.approve(user1, amount)).to.emit(
                      zapToken,
                      "Approval"
                  );
              });

              it("the allowance being set is accurate", async () => {
                  await zapToken.approve(user1, amount);
                  const allowance = await zapToken.allowance(deployer, user1);
                  assert.equal(allowance.toString(), amount);
              });

              it("won't allow a user to go over the allowance", async () => {
                  await zapToken.approve(user1, amount);
                  await expect(
                      playerToken.transferFrom(
                          deployer,
                          user1,
                          (40 * multiplier).toString()
                      )
                  ).to.be.revertedWith("ERC20: insufficient allowance");
              });
          });
      });
