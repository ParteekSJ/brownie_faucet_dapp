// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// abstract -- no function definitions?? just headers.  They can have function definitions too.
// any child of the abstract contract should implement the specified methods

abstract contract Logger {
    // storage variable
    uint256 public testNum;

    constructor() {
        testNum = 1000;
    }

    //function header | function to override
    function emitLog() public pure virtual returns (bytes32);

    //function definition
    function test3() public view returns (uint256) {
        return testNum;
    }
}
