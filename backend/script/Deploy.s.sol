// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "forge-std/Script.sol";
import { Pool } from '../src/Pool.sol';

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        uint256 end = 4 weeks;
        uint256 goal = 10 ether;
        Pool pool = new Pool(end, goal);
        vm.stopBroadcast();
    }
}