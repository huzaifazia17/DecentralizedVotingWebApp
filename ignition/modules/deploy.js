const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the MultiElection contract
    const MultiElection = await hre.ethers.getContractFactory("MultiElection");
    const multiElection = await MultiElection.deploy();

    await multiElection.deployed();
    console.log("MultiElection contract deployed to:", multiElection.address);

    // Adding 3 elections dynamically one that starts later, and 2 running immidiately
    const elections = [
        {
            title: "Presidential Election",
            candidates: ["Huzaifa", "Hanzalla", "Hanzalah", "Mohsin"],
            startTime: Math.floor(Date.now() / 1000) + 60, 
            endTime: Math.floor(Date.now() / 1000) + 600, 
        },
        {
            title: "City Council Polls",
            candidates: ["John", "Bill", "Bert"],
            startTime: Math.floor(Date.now() / 1000), 
            endTime: Math.floor(Date.now() / 1000) + 600, 
        },
        {
            title: "Board Of Directors",
            candidates: ["Huzaifa", "Mohsin", "Hanzallah"],
            startTime: Math.floor(Date.now() / 1000), 
            endTime: Math.floor(Date.now() / 1000) + 600, 
        },
    ];


    // Create the elections
    for (let i = 0; i < elections.length; i++) {
        const election = elections[i];
        const tx = await multiElection.createElection(
            election.title,
            election.candidates,
            election.startTime,
            election.endTime
        );
        await tx.wait();
        console.log(`Election "${election.title}" created.`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
