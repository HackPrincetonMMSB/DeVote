pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption{
    //gets the address of the contract and initializes an Adoption object
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    
    function testUsercanAdoptPet(){
        uint returnedId = adoption.adopt(8);
        
        uint expected = 8;
        Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded.");
    }
    
    function testGetAdopterAddressByPetId(){
        address expected = this; //this is the current sender's address
        address adopter = adoption.adopters(8);
        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
    }
    
    // Testing retrieval of all pet owners
    function testGetAdopterAddressByPetIdInArray() {
      // Expected owner is this contract
      address expected = this;

      // Store adopters in memory rather than contract's storage
      address[16] memory adopters = adoption.getAdopters();

      Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
    } 

}