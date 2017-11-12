var web3Provider = null;
var contracts = {};

/* our instance variables */
var candidates = {};
var numCandidates;
var page;

function init(args) {
    page = args;
    console.log("Initializing page: " + page);
    return initWeb3();
}

function initWeb3() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
        web3Provider = web3.currentProvider;
    } else {
        // If no injected web3 instance is detected, fallback to the TestRPC
        web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(web3Provider);
    return initContract();
}

function initContract(){
    $.getJSON('Vote.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var VoteArtifact = data;
        contracts.Vote = TruffleContract(VoteArtifact);

        // Set the provider for our contract
        contracts.Vote.setProvider(web3Provider);

        // Use our contract to retrieve and mark the adopted pets
        if(page == "vote" || page == "results"){
            getCandidates()
        }
    });
}

//updates the lists of candidates by calling for number of candidates and making n calls for each candidate
function getCandidates() {
    var voteInstance;

    candidates = {};
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            voteInstance.getNumCandidates.call().then(
                function(result){
                    numCandidates = result['c'][0];
                    for(var i=0;i<numCandidates;i++){
                        (function(foo){
                            voteInstance.getCandidate.call(foo).then(
                                function(hexName){
                                    var name = web3.toAscii(hexName);
                                    candidates[name] = 0;
                                    if(foo == numCandidates-1){
                                        if(page == "vote"){
                                            //updates the data on the vote page;
                                            setCandidates();
                                        }
                                        
                                        if(page == "results"){
                                            getVoteCounts();
                                        }
                                        console.log(candidates);
                                    }
                                }
                            )}(i));
                    }
                });
        }).catch(function(err) {
        console.log(err.message);
    });
}


function getVoteCounts(){
    var voteInstance;
    var i = 0;
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            for(var name in candidates) {
                if (candidates.hasOwnProperty(name)) {
                    (function(bar){
                        voteInstance.getVotesForCandidate.call(bar).then(
                            function(result) {
                                candidates[bar] = result['c'][0];
                                console.log(bar + " : " + candidates[bar]);
                                i++;
                                if(i==numCandidates){
                                    //successfully loaded all vote counts
                                    console.log("Loaded all vote counts");
                                    updateCounts();
                                }
                            }
                        )
                    }(name));
                }         
            }
        }).catch(function(err) {
        console.log(err.message);
    });
}

//returns true IFF address is valid AND has not voted yet  
//Called ONCE: when button is first pressed
function canVote(){
    var voteInstance;
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            voteInstance.eligible.call().then(function(result){
                console.log(result);
                if(page == "main"){
                    if(result){
                        loadVotePage();
                    } else {
                        validVoter();
                    }
                }
            });
        }).catch(function(err) {
        console.log(err.message);
        if (err.message == "Invalid JSON RPC response: \"\"") {
            /*var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.width = $(document).width;
            div.style.height = $(document).height;
            div.style.top = "0px";
            div.style.left = "0px";
            div.style.background = "black";
            div.style.color = "black";
            //div.style.opacity = 0.5;
            div.innerHTML = "You don't have MetaMask! This is good. This means you're a sane human being. But you also need to get MetaMask.";

            document.getElementById("metaMaskCover").appendChild(div);*/
            
            document.getElementById("metaMaskCover").style.visibility = "visible";
        }
    });
}

//returns true IFF address is valid
//Called ONCE: IFF canVote is false
function validVoter(){
    var voteInstance;
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            voteInstance.validVoter.call().then(function(result){
                if(result){
                    loadResultPage();
                } else {
                    handleInvalidVoter();
                }
                return result;
            });
        }).catch(function(err) {
        console.log(err.message);
    });
}


function sendVote(candidate) {
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.log(error);
        }

        var account = accounts[0];

        contracts.Vote.deployed().then(function(instance) {
            voteInstance = instance;
            console.log("Sending vote");
            // Execute adopt as a transaction by sending account
            voteInstance.sendVote(candidate, {from: account}).then(
                function(sendResult){
                    console.log(sendResult);
                    loadResultPage();
                }
            );
        }).catch(function(err) {
            console.log(err.message);
        });
    });
}

function getAddr(){
    var voteInstance;
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            voteInstance.caller.call().then(
                function(result) {
                    console.log(result);
                }
            )
        }           
    );
}



