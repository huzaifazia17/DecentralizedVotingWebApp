import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { VotingAddress, VotingAbi } from "../context/constant";
import { Button, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts";
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

function VotingPage() {
    const { id } = useParams();
    const [electionName, setElectionName] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState(null);
    const [canVote, setCanVote] = useState(false);
    const [electionStatus, setElectionStatus] = useState("");
    const [signerAddress, setSignerAddress] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);

    
    
    //check if metamask is installed and if not prompt the user to get it
    const initializeMetaMask = async () => {
        if (!window.ethereum) throw new Error("MetaMask is not installed. Please install MetaMask and try again.");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = window.ethereum.selectedAddress;

        //this listens for when the user switches an account on metamask
        window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                setSignerAddress(accounts[0]);
            } else {
                setSignerAddress(null);
            }
        });
        setSignerAddress(account);
        return account;
    };

    // get the contract details using the abi and address from the solidity file
    const getVotingContract = (account) => {
        const signer = rpcProvider.getSigner(account);
        return new ethers.Contract(VotingAddress, VotingAbi, signer);
    };

    // Fetch election details
    const fetchElectionDetails = async () => {
        setLoading(true);
        try {
            const contract = new ethers.Contract(VotingAddress, VotingAbi, rpcProvider);

            const election = await contract.getElection(id);
            const fetchedCandidates = await contract.getCandidates(id);

            const formattedCandidates = fetchedCandidates.map((candidate) => ({
                name: candidate.name,
                voteCount: candidate.voteCount.toString(),
            }));
            setCandidates(formattedCandidates);
            setElectionName(election.title);
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime < election.startTime.toNumber()) {
                setElectionStatus("Election has not started yet.");
                setCanVote(false);
            } else if (currentTime > election.endTime.toNumber()) {
                setElectionStatus("Election has ended.");
                setCanVote(false);

                getWinnerOrDraw(formattedCandidates);
            } else {
                setElectionStatus("Election is ongoing.");
                setCanVote(true);
            }

            // Check if user has already voted
            if (signerAddress) {
                const hasUserVoted = await contract.hasVoted(id, signerAddress);
                setHasVoted(hasUserVoted);
            }
        } catch (err) {
            console.error("Error fetching election details:", err);
        } finally {
            setLoading(false);
        }
    };

    // Voting function
    const vote = async (candidateIndex) => {
        if (loading) return;
        try {
            setLoading(true);
            setError(null);

            // Get the current mettmask account
            const account = await initializeMetaMask();
            console.log("Using account:", account);

            // Initialize contract using JSON RPC provider
            const contract = getVotingContract(account);

            // Send the vote transaction to the contract
            const tx = await contract.vote(id, candidateIndex, {
                gasLimit: 3000000,
            });

            console.log("Transaction sent:", tx.hash);
            await tx.wait();
            console.log("Transaction confirmed:", tx.hash);

            // refresh the election detals
            fetchElectionDetails();
            setError("Successfully voted!");

            if(signerAddress) {
                const hasUserVoted = await contract.hasVoted(id, signerAddress);
                setHasVoted(hasUserVoted);
                if (hasUserVoted) {
                    setError("You have already voted.");
                }
            }
        } catch (err) {
            console.error("Error during voting:", err);
        } finally {
            setLoading(false);
        }
    };

    const getWinnerOrDraw = (candidates) => {
        if (candidates.length === 0) {
            setWinner("No candidates available");
            return;
        }
    
        const highestVoteCount = Math.max(...candidates.map((candidate) => parseInt(candidate.voteCount, 10)));
        const potentialWinners = candidates.filter(
            (candidate) => parseInt(candidate.voteCount, 10) === highestVoteCount
        );
    
        if (potentialWinners.length > 1) {
            setWinner("The poll ends in a draw");
        } else if (potentialWinners.length === 1) {
            setWinner(`The Winner is: ${potentialWinners[0].name}`);
        }
    };
    

    // Fetch election details when the component mounts or election id changes
    useEffect(() => {
        fetchElectionDetails();
    }, [id, signerAddress]);
    

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h1>Election: {electionName}</h1>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                
                    
                    <p>{electionStatus}</p>
                    {/* display the winner and election information when it has ended */}
                    {electionStatus === "Election has ended." && (
                        <>
                            <h2 style={{ color: "green" }}>{winner}</h2>
                            <h3>Vote Distribution</h3>
                            <ul>
                                {candidates.map((candidate, index) => (
                                    <li key={index}>
                                        {candidate.name}: {candidate.voteCount} votes
                                    </li>
                                ))}
                            </ul>

                            {/* Display the vote distribution using MUI-x bar chart component */}
                            <BarChart
                                series={[
                                    {
                                        data: candidates.map((candidate) => parseInt(candidate.voteCount, 10)), 
                                        color: "#3f51b5",
                                    },
                                ]}
                                height={290}
                                xAxis={[
                                    {
                                        data: candidates.map((candidate) => candidate.name), 
                                        scaleType: 'band',
                                    },
                                ]}
                                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                            />
                        </>
                    )}

                    
                    {/* the user can vote so show the candidates and vote button*/}

                    {canVote ? (
                        <ul>
                            {candidates.map((candidate, index) => (
                                <li key={index}>
                                    {candidate.name}: {candidate.voteCount} votes
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => vote(index)}
                                        style={{ marginLeft: "10px" }}
                                        disabled={hasVoted}
                                    >
                                        {hasVoted ? "Voted Already" : "Vote"}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // the user cannot vote so show a message as to why
                        <p>{hasVoted ? "You have already voted." : "You cannot vote in this election."}</p>
                    )}
                    
                    
                </>
            )}
        </div>
    );
}

export default VotingPage;
