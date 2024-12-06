import React from 'react';
import { Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NavLink } from 'react-router-dom';
import ElectionCard from '../components/ElectionCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Home = () => {
  // Define Navigation Items
  const navigate = useNavigate();
  const handleNavigation = (segment) => {
    navigate(segment);
  };
  const NAVIGATION = [
    {
      segment: '/',
      title: 'Dashboard',
      icon: <DashboardIcon />,
    },
    {
      segment: '/create',
      title: 'Create Election',
      icon: <AddBoxIcon />,
    },
  ];

  // Define Theme
  const demoTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  return (
    <AppProvider
      theme={demoTheme}
      navigation={
        NAVIGATION.map((item) => ({
          title: item.title,
          icon: item.icon,
          onClick: () => handleNavigation(item.segment),
          
        }))
      }
    >
      <DashboardLayout>
        <Box sx={{ p: 4 }}>
          <ElectionCard />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Home;
