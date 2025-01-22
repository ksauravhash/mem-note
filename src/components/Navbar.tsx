import { useState } from "react";
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
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Navbar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Mobile drawer
  const [isCollapsed, setCollapsed] = useState(false); // Collapsible desktop

  const navItems = [
    { text: "Home", icon: <HomeIcon />, to: "/" },
    { text: "About", icon: <InfoIcon />, to: "/about" },
    { text: "Contact", icon: <ContactMailIcon />, to: "contact" },
  ];

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
        <Grid size={{ xs: 12 }} sx={{ width: 250 }}>
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Grid>
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
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <IconButton onClick={() => setCollapsed(!isCollapsed)}>
            <ChevronLeftIcon
              sx={{
                transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </IconButton>
        </Grid>
        <List>
          {navItems.map((item, index) => (
            <Link to={item.to} component={RouterLink} underline="none" color="textPrimary">
              <ListItem key={index} disablePadding>
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
    </Grid>
  );
};

export default Navbar;
