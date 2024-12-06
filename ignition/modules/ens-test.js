const { ethers } = require("hardhat");

async function main() {
    const provider = ethers.provider;

    const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; // ENS Registry
    const ensABI = [
        "function resolver(bytes32 node) external view returns (address)"
    ];
    const namehash = ethers.utils.namehash("vitalik.eth");

    const ens = new ethers.Contract(ensAddress, ensABI, provider);
    const resolverAddress = await ens.resolver(namehash);
    console.log("Resolver address:", resolverAddress);

    const resolverABI = [
        "function addr(bytes32 node) external view returns (address)"
    ];
    const resolver = new ethers.Contract(resolverAddress, resolverABI, provider);
    const address = await resolver.addr(namehash);
    console.log("Address for vitalik.eth:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
