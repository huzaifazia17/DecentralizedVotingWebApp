import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";


const DashboardLayout = ({ children }) => {

    // Define state for drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // Function to toggle the drawer when user clicks it
    const handleClick = () => {

        setDrawerOpen(!drawerOpen);

    };

    // sidebar navigation items
    const Sidebar_Navigation = [

        { text: "Home", icon: <DashboardIcon />, path: "/" },
        { text: "Create Election", icon: <AddBoxIcon />, path: "/create" },

    ];

    return (
        <Box sx={{ display: "flex" }}>
        {/* AppBar customized from MUI */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleClick}
                sx={{ marginRight: 2 }}
            >

                <MenuIcon />


            </IconButton>

            <Typography  variant="h5" noWrap>

                Choices

            </Typography>

            </Toolbar>
        </AppBar>

        {/* The drawer/ sidebar component used form MUI toolpad Dashboard*/}
        <Drawer
            variant="persistent"
            open={drawerOpen}
            sx={
                {
                    width: "240px",
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: "240px", boxSizing: "border-box" },
                }
        }
        >
            <Toolbar />
            <List>
            {Sidebar_Navigation.map((item, index) => (
                <ListItem 
                    button key={index} 
                    onClick={() => navigate(item.path)}
                >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                </ListItem>
            ))}
            </List>
        </Drawer>

        {/* this box ensures page contents dont conflict with bar contentes */}
        <Box
            component="main"
            sx={
                {
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.grey[900],
                        minHeight: "100vh",
                        marginLeft: drawerOpen ? `0px` : "-240px",
                        transition: "margin-left 0.3s ease",
                }
            }
        >
            <Toolbar />
            {children}
        </Box>
        </Box>
    );
};

export default DashboardLayout;
