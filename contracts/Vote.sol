pragma solidity ^0.4.4;

contract Vote{
    
    //maps each private key to a boolean (has this key voted yet)
    mapping (bytes32 => bool) hasVoted;
    
    //array of candidate strings
    bytes32[] public candidates;
    
    //maps each candidate name to an integer holding their votes
    mapping (bytes32 => uint) votes;
        
    //Constructor takes in an array of candidates
    function Vote(bytes32[] args){
        candidates = args;
        votes[candidates[0]] = 0;
        votes[candidates[1]] = 0;
        votes[candidates[2]] = 0;
    }
    
    /* --- PUBLIC FUNCTIONS --- */
    
    //returns the number of candidates
    function getNumCandidates() public returns (uint256) {
        return candidates.length;
    }    
    
    //returns the name of the nth candidate
    function getCandidate(uint8 n) public returns (bytes32){
        return candidates[n];
    }
    
    //returns the number of votes this candidate has recieved
    function getVotesForCandidate(bytes32 name) public returns (uint){
        return votes[name];
    }
    
    //returns true if vote was successful, false otherwise
    function sendVote(bytes32 voterID, bytes32 name) public returns (bool){
        if (!eligible(voterID)){
            return false;
        }
        
        votes[name] = votes[name] + 1;
        
        hasVoted[voterID] = true;
        return true;
    }
    
    //returns true if the voterID is eligible to cast a vote
    function eligible(bytes32 voterID) public returns (bool){
        if(hasVoted[voterID] == true){
            return false;
        }
        return true;
    }
    
}