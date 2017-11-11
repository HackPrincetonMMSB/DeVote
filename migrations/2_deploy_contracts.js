var Vote = artifacts.require("Vote");
var candidates = ["Sten","Jim", "Eisgruber"]

module.exports = function(deployer) {
  deployer.deploy(Vote, candidates);
};
