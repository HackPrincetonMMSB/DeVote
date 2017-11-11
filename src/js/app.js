var web3Provider = null;
var contracts = {};

/* our instance variables */

var candidates = {};
var numCandidates;


function init() {
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
        return getCandidates();
    });
    return bindEvents();
}

function bindEvents() {
    console.log("Here's where we bind the events");
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
                                        console.log(candidates);
                                        getVoteCounts();
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
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            for(var name in candidates) {
                if (candidates.hasOwnProperty(name)) {
                    (function(bar){
                        console.log(bar);
                        voteInstance.getVotesForCandidate.call(bar).then(
                            function(result) {
                                console.log(result);
                                candidates[bar] = result['c'][0];
                                console.log(bar + " : " + candidates[bar]);
                            }
                        )
                    }(name));
                }           
            }
            return candidates;
        }).catch(function(err) {
        console.log(err.message);
    });
}



function canVote(voterID){
    var voteInstance;
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            voteInstance.eligible.call(voterID).then(function(result){
                console.log(result); 
            });
        }).catch(function(err) {
        console.log(err.message);
    });
}



function sendVote(myName, name) {
    //event.preventDefault();

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
            voteInstance.sendVote(myName, name, {from: account}).then(
                function(sendResult){
                    console.log(sendResult);
                }
            );

        }).catch(function(err) {
            console.log(err.message);
        });
    });
}



function push(value){
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.log(error);
        }

        var account = accounts[0];

        contracts.Vote.deployed().then(function(instance) {
            voteInstance = instance;
            console.log("Sending value");
            // Execute adopt as a transaction by sending account
            voteInstance.sendValue(value, {from: account}).then(
                function(sendResult){
                    console.log(sendResult);
                }
            );

        }).catch(function(err) {
            console.log(err.message);
        });
    });
}

function get(){
    var voteInstance;
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            voteInstance.getValue.call().then(function(result){
                console.log(result);
            });
        }).catch(function(err) {
        console.log(err.message);
    });
}



function getSten(){
    var voteInstance;
    contracts.Vote.deployed().then(
        function(instance) {
            voteInstance = instance;
            voteInstance.getVotesForCandidate.call("Sten").then(
                function(result) {
                    console.log(result);
                }
            )
        }           
    );
}

$(function() {
    $(window).load(function() {
        init();
    });
});




/*App = {
    web3Provider: null,

    contracts: {},

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        // Is there is an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fallback to the TestRPC
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {
        $.getJSON('Vote.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var VoteArtifact = data;
            App.contracts.Vote = TruffleContract(VoteArtifact);

            // Set the provider for our contract
            App.contracts.Vote.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.updateVotes();
        });
        return App.bindEvents();
    },

    bindEvents: function() {
        console.log("Here's where we bind the events");
    },

    //updates the lists of candidates by calling for number of candidates and making n calls for each candidate
    updateVotes: function(adopters, account) {
        var voteInstance;
        var candidates = [];
        var numCandidates;

        App.contracts.Vote.deployed().then(
            function(instance) {
                voteInstance = instance;
                console.log(voteInstance);
                voteInstance.getNumCandidates.call().then(
                    function(result){
                        numCandidates = result['c'][0];
                        for(var i=0;i<numCandidates;i++){
                            voteInstance.getCandidate.call(i).then(
                                function(hexName){
                                    var name = processHex(hexName);
                                    candidates.push(name);
                                });   
                        }
                        console.log(candidates);
                    }
                )
                return candidates;
            }).catch(function(err) {
                console.log(err.message);
            });
    },

    handleAdopt: function() {
        event.preventDefault();

        var petId = parseInt($(event.target).data('id'));
        var adoptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function(instance) {
                adoptionInstance = instance;

                // Execute adopt as a transaction by sending account
                return adoptionInstance.adopt(petId, {from: account});
            }).then(function(result) {
                return App.markAdopted();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }

};

$(function() {
    $(window).load(function() {
        App.init();
    });
});

function processHex(input){
        //https://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript
        var hex = input.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
*/