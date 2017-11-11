function updateCounts(){
    
    
    
}

function handleVoteButton() {
    console.log("Checking voter eligibity");
    canVote();
}


//called from canVote
function loadVotePage(){
    console.log("Voter is eligible: loading vote page");
    window.location ="/vote.html";
}

//called from validVoter
function loadResultPage(){
    console.log("Loading result page");
    
}


function handleInvalidVoter(){
    console.log("Your address is not authorized to vote");
}


function setCandidates(){
    console.log("Received candidates, setting values");
    
    document.getElementsByClassName("can-title")[0].innerHTML
    var i =0;
    for (var key in candidates) {
        if (candidates.hasOwnProperty(key)) {
            document.getElementsByClassName("can-title")[i].innerHTML = key;
            i++;
        }
    }
}