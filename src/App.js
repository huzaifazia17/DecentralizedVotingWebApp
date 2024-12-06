import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import DashboardLayout from "./components/DashboardLayout"; // Custom layout with toolbar and sidebar
import ElectionCards from "./components/ElectionCard";
import VotingPage from "./pages/VotingPage";
import Home from "./pages/Home";
import CreateElection from "./components/CreateElection";
import MetaMaskLogin from "./components/MetaMaskLogin"; // MetaMask login component

// Define the theme
const theme = createTheme({
  palette: {
    mode: "dark", // Switch to "light" if needed
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#121212",
      paper: "#1c1c1c",
    },
  },
});

function App() {
  const [signerAddress, setSignerAddress] = useState(""); // Store the logged-in MetaMask account

  const handleLogin = (address) => {
    setSignerAddress(address); // Set the logged-in MetaMask account
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!signerAddress ? (
          // Show MetaMask login if not logged in
          <MetaMaskLogin onLogin={handleLogin} />
        ) : (
          // Render the main app if logged in
          <DashboardLayout>
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<ElectionCards />} />
                <Route path="/create" element={<CreateElection />} />
                <Route path="/election/:id" element={<VotingPage />} />
              </Routes>
            </Box>
          </DashboardLayout>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
