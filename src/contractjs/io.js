function updateCounts(){
    
    
    
}

// Handels vote button press
function voteButtonHandler() {
    
    // check is voter is elegible else redirect to non-elegible voter page 
    if validVoter() {

        // goto vote.html IFF user has not already voted
        if canVote() {
            window.location = "/vote.html";
        }

        // else show user election results so far
        else {
            window.location = "/countedVotes.html";
        }
    }    
    else {
        window.location = "/notElegible.html";
    }
        // check if voter has already voted otherwise redirect to hasVoted page

}



