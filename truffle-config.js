module.exports = {
    networks: {
      "live": {
        network_id: 1, // Ethereum public network
        // optional config values
        // host - defaults to "localhost"
        // port - defaults to 8545
        // gas
        // gasPrice
        // from - default address to use for any transaction Truffle makes during migrations
      },
      "morden": {
        network_id: 2,        // Official Ethereum test network
        host: "178.25.19.88", // Random IP for example purposes (do not use)
        port: 80             
      },
      "staging": {
        network_id: 1337 // custom private network
        // use default rpc settings
      },
      "development": {
        network_id: "default"
      }
    }
};
