import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";


const MetaMaskLogin = ({ onLogin }) => {
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    //check if metamask is installed and if not prompt the user to get it
    const initializeMetaMask = async () => {
        if (!window.ethereum) {
            setError("MetaMask is not installed. Please install MetaMask and try again.");
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setIsLoggedIn(true);
            onLogin(accounts[0]); 
            setError(null);
        } catch (err) {
            setError("Please connect MetaMask to access the application.");
        }
    };



    //useEffect to check if the user is logged in and if so set the state to true
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
                if (accounts.length > 0) {
                    setIsLoggedIn(true);
                    onLogin(accounts[0]);
                }
            });
        }
    }, [onLogin]);


    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            {!isLoggedIn ? (
                <>
                    <h2>Please log into MetaMask to access the application.</h2>
                    
                    {/* Button to connect to metamask and open the window for login */}
                    <Button
                        onClick={initializeMetaMask}
                        variant="contained"
                        color="primary"
                        sx={{
                            padding: "10px 20px",
                            fontSize: "16px",
                        }}
                    >
                        Connect MetaMask
                    </Button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </>
            ) : (
                <p>MetaMask connected! Redirecting...</p>
            )}
        </div>
    );
};


export default MetaMaskLogin;
