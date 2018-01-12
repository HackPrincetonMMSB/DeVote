# DeVote
*Best First-Time Hack at the 2017 Hack Princeton hackathon.*

A decentralized Voting application built on the Ethereum blockchain.

# What it does
DeVote provides the base code for anyone seeking to host a free, fair, and anonymous vote. Through our simple interface, the complex task of writing a smart contract and interfacing with the Ethereum blockchain can be greatly simplified. Through our framework, anyone can set up an election, defining the candidates running for election and the valid Ethereum addresses that are allowed to vote. This accomplishes a few major tasks. First off, by defining which addresses are allowed to submit votes, we can separate valid voters from invalid voters. Secondly, instead of tying one vote to one name (which poses issues in politically unstable environments), voting is completely anonymous. After an address has voted, its value is discarded, so the the anonymity of the vote sender is preserved. Finally, since all votes are tallied by each node in the blockchain, the vote count is confirmed through consensus. This removes any chance of fraud in the counting of votes (think Florida circa. 2000), and results are immediate and public.

This avoids the pitfalls of traditional voting systems. When an election is controlled by a single polling entity (generally the state), we trust the entity to count the votes, validate who's allowed to vote, and keep the vote of each individual secret. In many cases, this trust does not exist. DeVote is targeted at areas that would benefit greatly from decentralized voting systems, one that is decentralized, open-source, secure, and anonymous.

# Components
Our framework can be broken down into two major components: backend, which is served by a Solidity smart contract running the Ethereum Virtual Machine, and frontend, which uses the web3 API to communicate with the blockchain to read and write data.

The backend is ran by the EVM, which means its execution is done over the entire Ethereum blockchain. This accomplishes the goal of decentralization we set forth in our vision. Meanwhile, the frontend loads candidate data and also sends votes to the Ethereum nodes. Since DeVote requires Ether (gas) to process modifications to the data on the blockchain, apps built on DeVote require the use of Ethereum browsers. The simplest choice is MetaMask, a Google Chrome extension that can handle all Ether functions.

The website (no longer hosted), is a sample client built with DeVote. We set up an election for the next president of Princeton, and accept votes from a predefined set of addresses.

# Read more here: https://devpost.com/software/devote
