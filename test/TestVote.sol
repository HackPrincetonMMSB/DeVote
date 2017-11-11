pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Vote.sol";

contract TestVote{
    //gets the address of the contract and initializes a Vote object
    Vote vote = Vote(DeployedAddresses.Vote());
    
    function testCanRetrieveNum(){
        uint256 numCan = vote.getNumCandidates();
        uint256 expected = 3;
        Assert.equal(numCan, expected, "Should have 3 candidates.");
    }
    
    function testCanGetCandidate() {
        bytes32 candidate = vote.getCandidate(0);
        bytes32 expected = "Sten";
        Assert.equal(candidate, expected, "Not equal (1)");
        candidate = vote.getCandidate(1);
        expected = "Jim";
        Assert.equal(candidate, expected, "Not equal (2)");
        candidate = vote.getCandidate(2);
        expected = "Eisgruber";
        Assert.equal(candidate, expected, "Not equal (3)");
    }
    
    /*
    function testCanGetVoteForCandidate() {
        uint numVotes = vote.getVotesForCandidate("Sten");
        Assert.equal(0, numVotes, "Votes not initialized to 0");
        vote.sendVote("Sten");
        numVotes = vote.getVotesForCandidate("Sten");
        Assert.equal(1, numVotes, "Votes could not increment");
    }*/
    
    
    event test_value(int indexed val);

    function testCanVote(){
        //address add = 0x627306090abab3a6e1400e9345bc60c78a8bef57;
        //Assert.equal(add,vote.caller(), "Wrong address");
    
        bool result = vote.eligible();
        Assert.equal(true, result, "Michael can't vote");
        
        result = vote.sendVote("Sten");
        Assert.equal(true, result, "Vote failed");
        
        result = vote.eligible();
        Assert.equal(false, result, "Michael shouldn't be able to vote");
    }
}