// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Owned {
    address public owner = msg.sender;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }
}
