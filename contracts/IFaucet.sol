// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// I - Interface : An interface in the Java programming language is an abstract type that is used to specify a behavior that classes must implement. They are similar to protocols.

// 1. Cannot inherit from other smart contracts. Can only inherit from other interfaces.
// 2. Cannot declare a constructor
// 3. Cannot declare state variables
// 4. All declared functions must be 'external'

interface IFaucet {
    function addFunds() external payable;

    function withdrawFunds(uint256 amount) external;
}
