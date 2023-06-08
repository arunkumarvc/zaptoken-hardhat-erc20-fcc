// https://docs.openzeppelin.com/contracts/4.x/erc20
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice The contract inherits from the OpenZeppelin ERC20 contract,
 * which provides a standard implementation of many of the core functions
 * for an ERC20 token.
 * @title ZapToken
 * @dev A simple ERC20 token.
 */
contract ZapToken is ERC20 {
    /**
     * @param initialSupply The initial supply of tokens to mint.
     * @notice initialSupply 50 is 50 WEI, 50e18 or 50*10**18 is 50 ETH.
     */
    constructor(uint256 initialSupply) ERC20("ZapToken", "ZAP") {
        _mint(msg.sender, initialSupply);
    }
}
