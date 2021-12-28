// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    // storage variables
    mapping(address => bool) private funders;
    mapping(uint256 => address) private LUTfunders;
    uint256 public numOfFunders;

    // @notice contract can receive Ether.
    receive() external payable {}

    event Deposit(address indexed _from, address indexed _to, uint256 _value);
    event Withdraw(address indexed _from, address indexed _to, uint256 _value);

    // MODIFIERS
    modifier limitWithdraw(uint256 amount) {
        require(
            amount <= 500000000000000000,
            "Cannot withdraw more than 0.5 ETH"
        );
        _;
    }

    // ADD FUNDS
    function addFunds() external payable override {
        address funder = msg.sender;

        // preventing duplication
        if (!funders[funder]) {
            uint256 index = numOfFunders;
            funders[funder] = true;
            LUTfunders[index] = funder;
            numOfFunders++;
        }

        emit Deposit(funder, address(this), msg.value);
    }

    // WITHDRAW FUNDS
    function withdrawFunds(uint256 amount)
        external
        override
        limitWithdraw(amount)
    {
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, address(this), amount);
    }

    // RETRIEVE FUNDER AT A SPECIFIC INDEX
    function getFunderAtIndex(uint8 idx) external view returns (address) {
        return LUTfunders[idx];
    }

    // RETRIEVE ALL FUNDERS
    function getAllFunders() external view returns (address[] memory) {
        // creating an empty address[] of size 'numOfFunders'
        address[] memory _funders = new address[](numOfFunders);

        // numOfFunders exists sequentially
        for (uint256 i = 0; i < numOfFunders; i++) {
            // retrieving address from the main mapping and assigning to our _funders
            _funders[i] = LUTfunders[i];
        }

        return _funders;
    }

    // Conforming to an abstract class
    function emitLog() public pure override returns (bytes32) {
        return "Hello";
    }
}
