function updateCounts(){
    console.log("Recieved vote data");

    var i = 0;
    var voteCounts = document.getElementsByClassName("result-p");
     for (var key in candidates) {
        if (candidates.hasOwnProperty(key)) {
            voteCounts[i].innerHTML = candidates[key];
            i++;
        }
    }
    
    console.log(candidates);
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
    window.location ="/result.html";
}


function handleInvalidVoter(){
    console.log("Your address is not authorized to vote");
}


function setCandidates(){
    console.log("Received candidates, setting values");
    var titles = document.getElementsByClassName("can-title");
    var buttons = document.getElementsByClassName("vote-button");
    
    var i =0;
    for (var key in candidates) {
        if (candidates.hasOwnProperty(key)) {
            titles[i].innerHTML = key;
            (function(foo){
                buttons[i].addEventListener("click", function(){
                vote(foo);
                });
            }(key));
            i++;
        }
    }
}

function vote(name){
    console.log("Voting for: " + name);
    sendVote(name);
}