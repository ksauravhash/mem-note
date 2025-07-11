import { useContext, useState } from "react";
import {
  Drawer,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Link,
  Box,
  Typography,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "./Auth";

const Navbar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Mobile drawer
  const [isCollapsed, setCollapsed] = useState(false); // Collapsible desktop

  const authValuesOb = useContext(AuthContext);

  const navItems = [
    { text: "Home", icon: <HomeIcon />, to: "/" },
    { text: "About", icon: <InfoIcon />, to: "/about" },
    { text: "Contact", icon: <ContactMailIcon />, to: "/contact" },
  ];

  const logout = () => {
    authValuesOb?.clearAuth();
    setDrawerOpen(false);
  };

  // Get first letter of user name for avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Mobile Menu Button */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          backgroundColor: "background.paper",
          boxShadow: 1,
          zIndex: 1100,
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Box sx={{ width: 280, height: "100%" }}>
          {/* App Logo/Title */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              Mem-Note
            </Typography>
          </Box>
          
          <Divider />
          
          {/* User Profile Section */}
          {authValuesOb?.authValues?.user && (
            <>
              <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                  {getInitial(authValuesOb.authValues.user.name)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    {authValuesOb.authValues.user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {authValuesOb.authValues.user.email || "User"}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </>
          )}

          {/* Navigation Items */}
          <List sx={{ pt: 1 }}>
            {navItems.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                component={RouterLink}
                underline="none"
                color="textPrimary"
              >
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => setDrawerOpen(false)}
                    sx={{ 
                      borderRadius: '0 24px 24px 0', 
                      mx: 1,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "primary.main" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>

          {/* Logout Button */}
          {authValuesOb?.authValues?.user && (
            <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 2 }}>
              <Divider sx={{ mb: 1 }} />
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={logout}
                  sx={{ 
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "error.light",
                      color: "error.contrastText",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "error.main" }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: isCollapsed ? 70 : 240,
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          transition: "width 0.3s ease",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1200,
          boxShadow: 1,
        }}
      >
        {/* App Logo/Title */}
        <Box 
          sx={{ 
            p: 2, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: isCollapsed ? "center" : "space-between",
          }}
        >
          {!isCollapsed && (
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              Mem-Note
            </Typography>
          )}
          <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <IconButton 
              onClick={() => setCollapsed(!isCollapsed)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <ChevronLeftIcon
                sx={{
                  transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        {/* User Profile Section */}
        {authValuesOb?.authValues?.user && (
          <>
            <Box 
              sx={{ 
                py: 2,
                px: isCollapsed ? 1 : 2,
                display: "flex", 
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
              }}
            >
              <Tooltip title={authValuesOb.authValues.user.name}>
                <Avatar 
                  sx={{ 
                    bgcolor: "primary.main",
                    ...(isCollapsed ? {} : { mr: 2 })
                  }}
                >
                  {getInitial(authValuesOb.authValues.user.name)}
                </Avatar>
              </Tooltip>
              {!isCollapsed && (
                <Box sx={{ overflow: "hidden" }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: "medium",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {authValuesOb.authValues.user.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {authValuesOb.authValues.user.email || "User"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider />
          </>
        )}

        {/* Navigation Items */}
        <List sx={{ pt: 1, flexGrow: 1 }}>
          {navItems.map((item, index) => (
            <Link
              to={item.to}
              key={index}
              component={RouterLink}
              underline="none"
              color="textPrimary"
            >
              <ListItem disablePadding>
                <Tooltip title={isCollapsed ? item.text : ""} placement="right">
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      px: isCollapsed ? 2.5 : 3,
                      borderRadius: isCollapsed ? 1 : '0 24px 24px 0',
                      mx: isCollapsed ? 1 : 1,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 2,
                        justifyContent: "center",
                        color: "primary.main",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </Link>
          ))}
        </List>

        {/* Logout Button */}
        {authValuesOb?.authValues?.user && (
          <Box sx={{ p: isCollapsed ? 1 : 2 }}>
            <Divider sx={{ mb: 1 }} />
            <Tooltip title={isCollapsed ? "Logout" : ""} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: isCollapsed ? 2.5 : 3,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "error.contrastText",
                  },
                }}
                onClick={logout}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                    color: "error.main",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary="Logout" />}
              </ListItemButton>
            </Tooltip>
          </Box>
        )}
      </Box>
      
      {/* Add a spacer to push content to the right of the sidebar */}
      <Box sx={{ 
        width: isCollapsed ? 70 : 240, 
        flexShrink: 0,
        display: { xs: "none", sm: "block" },
        transition: "width 0.3s ease"
      }} />
    </Grid>
  );
};

export default Navbar;
