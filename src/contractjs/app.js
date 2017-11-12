/* app.js */
/*Main front-end Javascript. Asynchronous Javascript is used since our architecture has layers of dependencies on fetched data.*/
/* Handles client-blockchain interactions. Defines a set of functions that each performs client-side actions as the result of web3 callback functions */

var web3Provider = null;
var contracts = {};

/* instance variables */
//Object containing candidate: votes pairs
var candidates = {};
//Number of total candidates
var numCandidates;
//which page the io.js is operating on (state based code)
var page;

//Basic handler to call initializer for Web3
function init(args) {
    page = args;
    console.log("Initializing page: " + page);
    return initWeb3();
}

//Initializer for Web3. Also calls the initializer for the smart contract.
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

//Initializer for the smart contract. Also calls the getCandidates function to load the possible candidates to vote for.
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
                    numCandidates = result['c'][0]; //Format of the JSON object requires us to get the number of candidates like this
                    for(var i=0;i<numCandidates;i++){
                        (function(foo){ //anonymous function to make sure asynchronous Javascript function gets called for every i.
                            voteInstance.getCandidate.call(foo).then(
                                function(hexName){
                                    var name = web3.toAscii(hexName);
                                    candidates[name] = 0;
                                    if(foo == numCandidates-1){ //Making sure this is called after we initialize.
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
                if (candidates.hasOwnProperty(name)) { //Maps have default objects, so we need to make sure it's not one of those.
                    (function(bar){
                        voteInstance.getVotesForCandidate.call(bar).then(
                            function(result) {
                                candidates[bar] = result['c'][0]; //Way to get the number of votes from the object.
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
                        loadVotePage(); //Page functions implemented outside of this file.
                    } else {
                        validVoter();
                    }
                }
            });
        }).catch(function(err) {
<<<<<<< HEAD
        console.log(err.message);
        if (err.message == "Contract has not been deployed to detected network (network/artifact mismatch)") {
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
            
=======
        if (err.message == "Contract has not been deployed to detected network (network/artifact mismatch)") {     
>>>>>>> Final CSS changes and changes for final deployment onto blockchain
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
                if(result){ //If vote has deployed or not.
                    loadResultPage(); //Page functions implemented outside of this file.
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

function getAddr(){ //Tester fucntion; gets the address of the voter
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



