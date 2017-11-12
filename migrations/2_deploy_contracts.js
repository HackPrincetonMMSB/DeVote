var Vote = artifacts.require("Vote");
var candidates = ["C. Eisgruber","Eis Eis Gruber", "Chris"];
var addresses = ['0x627306090abab3a6e1400e9345bc60c78a8bef57','0xf17f52151ebef6c7334fad080c5704d77216b732','0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef', '0x7ad8085afC1166b7773741AD67522024D8bC2FC4', '0x41d27542b0dfad88Ff13df7F2a28Facb31AC620A', '0xA8C2C2a3E564b74065ca60C442efe4d701eB800E', '0xF91B6fD0F9d3c1692729C10B80a0f054e281A8f9'];

//Address to Person directory (TESTING PURPOSES ONLY, real client implementation would not have this)
//0x627 is Test 1 and the Host
//0xf17 is Test 2
//0xC5 is Test 3
//0x7ad is Michael Man
//0x41 is Sten
//0xA8C is Michael Psenka
//0xF91 is Bevin

module.exports = function(deployer) {
  deployer.deploy(Vote, candidates, addresses);
};
