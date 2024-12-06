require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: "0.8.4",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",  // Connect to local Hardhat node
            chainId: 31337, // Default Hardhat network chain ID
        },
    },
};
