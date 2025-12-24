import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import CommentIcon from "@mui/icons-material/Comment";
import { Link, useNavigate } from "react-router-dom";
import { BE_URL } from "../../lib/config";

function TopBar({ context, user, setUser, setContext }) {
  const navigate = useNavigate();

  const [userQuery, setUserQuery] = useState("");
  const [commentQuery, setCommentQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchType, setSearchType] = useState("");

  const handleLogout = async () => {
    try {
      await fetch(`${BE_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setContext("Home");

      setUserQuery("");
      setCommentQuery("");
      setSearchResults([]);
      setOpenDialog(false);

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchUser = async () => {
    if (!userQuery.trim()) return;
    try {
      const res = await fetch(`${BE_URL}/user/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchText: userQuery }),
      });
      const data = await res.json();
      setSearchResults(data);
      setSearchType("user");
      setOpenDialog(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchComment = async () => {
    if (!commentQuery.trim()) return;
    try {
      const res = await fetch(`${BE_URL}/comment/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchText: commentQuery }),
      });
      const data = await res.json();
      setSearchResults(data);
      setSearchType("comment");
      setOpenDialog(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photo Sharing
          </Typography>

          {user && (
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                size="small"
                placeholder="Search User..."
                variant="outlined"
                sx={{ bgcolor: "white", borderRadius: 1, width: 200 }}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchUser()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleSearchUser}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                size="small"
                placeholder="Search Comments..."
                variant="outlined"
                sx={{ bgcolor: "white", borderRadius: 1, width: 200 }}
                value={commentQuery}
                onChange={(e) => setCommentQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchComment()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleSearchComment}>
                        <CommentIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
                {context}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ ml: 2, fontWeight: "bold" }}
              >
                Hi, {user.first_name}
              </Typography>

              <Button
                color="inherit"
                //startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        disableRestoreFocus
      >
        <DialogTitle>
          Search Results (
          {searchType === "user" ? "Users" : "Photos with Comments"})
        </DialogTitle>
        <DialogContent>
          <List>
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div key={item._id}>
                  {searchType === "user" ? (
                    <ListItem
                      button
                      component={Link}
                      to={`/users/${item._id}`}
                      onClick={() => setOpenDialog(false)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${item.first_name} ${item.last_name}`}
                        secondary={item.occupation}
                      />
                    </ListItem>
                  ) : (
                    <ListItem
                      button
                      component={Link}
                      to={`/photos/${item.user_id._id || item.user_id}`}
                      onClick={() => setOpenDialog(false)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="square"
                          src={`${BE_URL}/images/${item.file_name}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          item.user_id && item.user_id.first_name
                            ? `Posted by ${item.user_id.first_name} ${item.user_id.last_name}`
                            : "Posted by Unknown User"
                        }
                        secondary={`Contains matched comments`}
                      />
                    </ListItem>
                  )}
                  <Divider />
                </div>
              ))
            ) : (
              <Typography p={2} align="center">
                No results found.
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TopBar;
