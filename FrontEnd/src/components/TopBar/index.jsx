import React from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { BE_URL } from "../../lib/config";

function TopBar({ context, user, setUser, setContext }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${BE_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      if (setContext) setContext("Home");
      navigate("/login");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photo Sharing
          </Typography>

          <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
            {context}
          </Typography>

          {user ? (
            <>
              <Typography variant="h6" sx={{ marginRight: 2 }}>
                Hi {user.first_name}
              </Typography>

              {/* <Button
                color="inherit"
                component={Link}
                to="/upload"
                sx={{ marginRight: 1, border: "1px solid white" }}
              >
                Add Photo
              </Button> */}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="h6">Please Login</Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBar;
