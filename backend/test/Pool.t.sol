// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "forge-std/Test.sol";
import { Pool } from "../src/Pool.sol";

contract PoolTest is Test {

    address owner = makeAddr("User0");
    address addr1 = makeAddr("User1");
    address addr2 = makeAddr("User2");
    address addr3 = makeAddr("User3");

    uint256 end = 4 weeks;
    uint256 goal = 10 ether;

    Pool pool;
    
    function setUp() public {
        vm.prank(owner);
        pool = new Pool(end, goal);
    }

    function test_ContractDeployedSuccessfully() public {
        address _owner = pool.owner();
        assertEq(owner, _owner);
        uint256 _end = pool.end();
        assertEq(end + block.timestamp, _end);
        uint256 _goal = pool.goal();
        assertEq(goal, _goal);
    }

    // Contribute
    function test_RevertWhen_EndIsReached() public {
        vm.warp(pool.end() + 3600);

        bytes4 selector = bytes4(keccak256("CollectIsFinished()"));
        vm.expectRevert(abi.encodeWithSelector(selector));

        vm.prank(addr1);
        vm.deal(addr1, 1 ether);
        pool.contribute{value: 1 ether}();
    }

    function test_RevertWhen_NotEnoughFunds() public {
        bytes4 selector = bytes4(keccak256("NotEnoughFunds()"));
        vm.expectRevert(abi.encodeWithSelector(selector));

        vm.prank(addr1);
        pool.contribute();
    }

    function test_ExpectEmit_SuccessfullContribute(uint96 _amount) public {
        vm.assume(_amount > 0);
        vm.expectEmit(true, false, false, true);
        emit Pool.Contribute(address(addr1), _amount);

        vm.prank(addr1);
        vm.deal(addr1, _amount);
        pool.contribute{value: _amount}();
    }

    // Withdraw
    function test_RevertWhen_NotTheOwner() public {
        bytes4 selector = bytes4(keccak256("OwnableUnauthorizedAccount(address)"));
        vm.expectRevert(abi.encodeWithSelector(selector, addr1));

        vm.prank(addr1);
        pool.withdraw();
    }

    function test_RevertWhen_EndIsNotReached() public {
        bytes4 selector = bytes4(keccak256("CollectNotFinished()"));
        vm.expectRevert(abi.encodeWithSelector(selector));

        vm.prank(owner);
        pool.withdraw();
    }

    function test_RevertWhen_GoalIsNotReached() public {
        vm.prank(addr1);
        vm.deal(addr1, 12 ether);
        pool.contribute{value: 12 ether}();

        bytes4 selector = bytes4(keccak256("CollectNotFinished()"));
        vm.expectRevert(abi.encodeWithSelector(selector));

        vm.prank(owner);
        pool.withdraw();
    }

    function test_RevertWhen_WithdrawFailedToSendEther() public {
        pool = new Pool(end, goal);

        vm.prank(addr1);
        vm.deal(addr1, 6 ether);
        pool.contribute{value: 6 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 7 ether);
        pool.contribute{value: 7 ether}();

        vm.warp(pool.end() + 3600);

        bytes4 selector = bytes4(keccak256("FailedToSendEther()"));
        vm.expectRevert(abi.encodeWithSelector(selector));

        pool.withdraw();
    }

    function test_withdraw() public {
        vm.prank(addr1);
        vm.deal(addr1, 6 ether);
        pool.contribute{value: 6 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 7 ether);
        pool.contribute{value: 7 ether}();

        vm.warp(pool.end() + 3600);

        vm.prank(owner);
        pool.withdraw();
    }

    // Refund
    function test_RevertWhen_CollectNotFinished() public {
        vm.prank(addr1);
        vm.deal(addr1, 6 ether);
        pool.contribute{value: 6 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 7 ether);
        pool.contribute{value: 7 ether}();

        bytes4 selector = bytes4(keccak256("CollectNotFinished()"));
        vm.expectRevert(abi.encodeWithSelector(selector));

        vm.prank(addr1);
        pool.refund();
    }

    function test_RevertWhen_GoalAlreadyReached() public {
        vm.prank(addr1);
        vm.deal(addr1, 6 ether);
        pool.contribute{value: 6 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 7 ether);
        pool.contribute{value: 7 ether}();

        vm.warp(pool.end() + 3600);
        
        bytes4 selector = bytes4(keccak256("GoalAlreadyReached()"));
        vm.expectRevert(abi.encodeWithSelector(selector));
        pool.refund();
    }

    function test_RevertWhen_NoContribution() public {
        vm.prank(addr1);
        vm.deal(addr1, 6 ether);
        pool.contribute{value: 6 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 1 ether);
        pool.contribute{value: 1 ether}();
        
        vm.warp(pool.end() + 3600);

        bytes4 selector = bytes4(keccak256("NoContribution()"));
        vm.expectRevert(abi.encodeWithSelector(selector));
        vm.prank(addr3);
        pool.refund();
    }

    function test_RevertWhen_RefundFailedToSendEther() public {
        pool = new Pool(end, goal);

        vm.deal(address(pool), 2 ether);
        pool.contribute{value: 2 ether}();

        vm.prank(addr1);
        vm.deal(addr1, 6 ether);
        pool.contribute{value: 6 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 1 ether);
        pool.contribute{value: 1 ether}();

        vm.warp(pool.end() + 3600);

        bytes4 selector = bytes4(keccak256("FailedToSendEther()"));
        vm.expectRevert(abi.encodeWithSelector(selector));

        pool.refund();
    }

    function test_refund() public {
        vm.prank(addr1);
        vm.deal(addr1, 6 ether);
        pool.contribute{value: 6 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 1 ether);
        pool.contribute{value: 1 ether}();
        
        vm.warp(pool.end() + 3600);

        uint256 balanceBeforeRefund = addr2.balance;

        vm.prank(addr2);
        pool.refund();

        uint256 balanceAfterRefund = addr2.balance;

        assertEq(balanceBeforeRefund + 1 ether, balanceAfterRefund);
    }

    

}