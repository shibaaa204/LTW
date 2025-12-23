import React, { useState, useEffect } from "react"
import {
    Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box
} from "@mui/material"
import { Link } from "react-router-dom"
import PersonIcon from '@mui/icons-material/Person'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import CommentIcon from '@mui/icons-material/Comment'
import fetchModel from "../../lib/fetchModelData"
import "./styles.css"

function UserList({ refreshKey }) {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchModel("/user/list")
                if (data) setUsers(data)
            } catch (err) {
                console.error("Error fetching user list:", err)
            }
        }
        fetchData()
    }, [refreshKey])

    return (
        <div>
            <Typography variant="h6" className="user-list-title">User List</Typography>
            <List component="nav">
                {users.map((item) => (
                    <React.Fragment key={item._id}>
                        <ListItem button component={Link} to={`/users/${item._id}`} className="user-list-item">
                            <ListItemAvatar>
                                <Avatar className="user-avatar"><PersonIcon /></Avatar>
                            </ListItemAvatar>

                            <ListItemText primary={
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                    <Typography variant="body1" className="user-name">
                                        {item.first_name} {item.last_name}
                                    </Typography>

                                    {item.photo_count > 0 && (
                                        <Box className="bubble photo-bubble" title="Photos posted">
                                            <PhotoCameraIcon style={{ fontSize: 12, marginRight: 2 }} />
                                            {item.photo_count}
                                        </Box>
                                    )}
                                    {item.photo_count > 0 && (
                                        <Box className="bubble comment-bubble" title="Comments posted">
                                            <CommentIcon style={{ fontSize: 12, marginRight: 2 }} />
                                            {item.comment_count}
                                        </Box>
                                    )}
                                </Box>
                            } />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </div>
    )
}
export default UserList