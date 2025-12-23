import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, IconButton, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { BE_URL } from '../../lib/config'
import './styles.css'

function UserComment({ comment, currentUser, photoId, onRefresh }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(comment.comment)

    const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium', timeStyle: 'short',
    })

    const isOwner = currentUser && (
        (comment.user_id && currentUser._id === comment.user_id.toString()) || 
        (comment.user && comment.user._id && currentUser._id === comment.user._id.toString())
    )

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return
        // alert("[UserComment] Handle Delete")
        try {
            const response = await fetch(`${BE_URL}/comment/delete/${photoId}/${comment._id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (!response.ok) {
                const err = await response.text()
                throw new Error(err)
            }

            // const data = await response.json()
            // alert(`[UserComment] API:  ${data.message}`)
            if (onRefresh) {
                // alert("[UserComment] Call onRefresh() -> UserPhotos")
                onRefresh() 
            }
        } catch (error) {
            console.error("Delete failed", error)
            alert("Delete failed: " + error.message)
        }
    }

    const handleEditSubmit = async () => {
        if (!editText.trim()) return 

        try {
            const response = await fetch(`${BE_URL}/comment/edit/${photoId}/${comment._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_text: editText }),
                credentials: 'include',
            })

            if (!response.ok) {
                const err = await response.text()
                throw new Error(err)
            }
            setIsEditing(false)
            if (onRefresh) onRefresh() 

        } catch (error) {
            console.error("Edit failed", error)
            alert("Edit failed: " + error.message)
        }
    }

    return (
        <Box className="comment-box">
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="subtitle2" component="span" fontWeight="bold">
                        {comment.user ? (
                            <Link to={`/users/${comment.user._id}`} className="comment-user-link">
                                {comment.user.first_name} {comment.user.last_name}
                            </Link>
                        ) : (
                            <span>Unknown User</span>
                        )}
                    </Typography>
                    {" "}
                    <Typography variant="caption" color="text.secondary" className="comment-timestamp">
                        {dateTimeFormatter.format(new Date(comment.date_time))}
                    </Typography>
                </Box>
                
                {isOwner && !isEditing && (
                    <Box>
                        <IconButton size="small" onClick={() => setIsEditing(true)} title="Edit">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={handleDelete} title="Delete">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {isEditing ? (
                <Box mt={1} display="flex" gap={1} alignItems="center">
                    <TextField 
                        fullWidth 
                        size="small" 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)} 
                        autoFocus
                        onKeyDown={(e) => {
                             if (e.key === 'Enter') handleEditSubmit()
                             if (e.key === 'Escape') {
                                setIsEditing(false)
                                setEditText(comment.comment)
                             }
                        }}
                    />
                    <IconButton color="primary" onClick={handleEditSubmit} title="Save">
                        <SaveIcon />
                    </IconButton>
                    <IconButton color="default" onClick={() => {
                        setIsEditing(false)
                        setEditText(comment.comment)
                    }} title="Cancel">
                        <CancelIcon />
                    </IconButton>
                </Box>
            ) : (
                <Typography variant="body2" className="comment-text">
                    {comment.comment}
                </Typography>
            )}
        </Box>
    )
}

export default UserComment