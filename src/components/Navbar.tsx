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
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import UserIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "./Auth";

const Navbar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Mobile drawer
  const [isCollapsed, setCollapsed] = useState(false); // Collapsible desktop

  const authValuesOb = useContext(AuthContext);

  const navItems = [
    { text: "Home", icon: <HomeIcon />, to: "/" },
    { text: "About", icon: <InfoIcon />, to: "/about" },
    { text: "Contact", icon: <ContactMailIcon />, to: "contact" },
  ];

  const logout = () => {
    authValuesOb?.clearAuth();
    setDrawerOpen(false);
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Mobile Drawer */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          top: 10,
          left: 10,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          sx={{ height: "100%", width: 250 }}
        >
          {/* Navigation Items */}
          <List>
            {authValuesOb?.authValues?.user && (
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <UserIcon />
                  </ListItemIcon>
                  <ListItemText primary={authValuesOb.authValues.user.name} />
                </ListItemButton>
              </ListItem>
            )}
            {navItems.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                component={RouterLink}
                underline="none"
                color="textPrimary">
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>setDrawerOpen(false)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Grid>
        {authValuesOb?.authValues?.user && (
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        )}
      </Drawer>

      {/* Desktop Sidebar */}
      <Grid
        sx={{
          width: isCollapsed ? 70 : 200,
          bgcolor: "background.paper",
          borderRight: "1px solid #ddd",
          display: { xs: "none", sm: "block" },
          transition: "width 0.3s ease",
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          sx={{ height: "100%" }}
        >
          {/* Collapsible Header */}
          <Grid>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <IconButton onClick={() => setCollapsed(!isCollapsed)}>
                <ChevronLeftIcon
                  sx={{
                    transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </IconButton>
            </Box>

            {/* Navigation Items */}
            <List>
              {authValuesOb?.authValues && (
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      px: isCollapsed ? 2 : 3,
                      height: 60,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 2,
                        justifyContent: "center",
                      }}
                    >
                      <UserIcon />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={authValuesOb?.authValues?.user.name}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              )}
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
                      sx={{
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        px: isCollapsed ? 2 : 3,
                        height: 60,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isCollapsed ? 0 : 2,
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!isCollapsed && <ListItemText primary={item.text} />}
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Grid>

          {/* Logout Button */}
          {authValuesOb?.authValues && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: isCollapsed ? 2 : 3,
                  height: 60,
                }}
                onClick={logout}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={"Logout"} />}
              </ListItemButton>
            </ListItem>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Navbar;
