import React, { useState } from "react";
import { ethers } from "ethers";
import { VotingAddress, VotingAbi } from "../context/constant";
import { 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Alert, 
    Stack, 
    Container,
    Grid2 
 } from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";

function CreateElection() {
    const [title, setTitle] = useState("");
    const [candidates, setCandidates] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState(null);

    const handleCreateElection = async () => {
        try {
            setStatus("Creating election...");
            setError(null);

            // Check if MetaMask is available
            if (typeof window.ethereum === "undefined") {
                setError("MetaMask is not installed. Please install MetaMask and try again.");
                setStatus("");
                return;
            }

            // Initialize Web3 provider
            const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

            // Request user to connect their account

            // Get signer from the provider
            const signer = provider.getSigner();

            // Initialize contract
            const contract = new ethers.Contract(VotingAddress, VotingAbi, signer);

            // Prepare candidates array
            const candidateArray = candidates.split(",").map((name) => name.trim());

            // Convert times to UNIX timestamp
            const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

            if (startTimestamp >= endTimestamp) {
                setError("Start time must be before end time.");
                setStatus("");
                return;
            }

            // Create election transaction
            const tx = await contract.createElection(title, candidateArray, startTimestamp, endTimestamp);
            await tx.wait();

            setStatus(`Election "${title}" created successfully!`);
            setTitle("");
            setCandidates("");
            setStartTime("");
            setEndTime("");
        } catch (err) {
            console.error("Error creating election:", err);
            setError("Failed to create election. Ensure you're the contract owner and try again.");
            setStatus("");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Create New Election
            </Typography>
            {status && <Alert severity="success" sx={{ mb: 2 }}>{status}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form">
                <Grid2 spacing={3}>
                    <TextField
                        margin="normal"
                        label="Election Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter election title"
                    />
                    <TextField
                    
                        margin="normal"
                        label="Candidates (comma-separated)"
                        fullWidth
                        value={candidates}
                        onChange={(e) => setCandidates(e.target.value)}
                        placeholder="Enter candidates (e.g., Alice, Bob, Charlie)"
                    />
                    <TextField
                        margin="normal"
                        type="datetime-local"
                        
                        fullWidth
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        type="datetime-local"
                        fullWidth
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color={ "primary"}
                        fullWidth
                        onClick={handleCreateElection}
                    >
                        Create Election
                    </Button>
                </Grid2>
            </Box>
        </Container>
    );
}

export default CreateElection;
