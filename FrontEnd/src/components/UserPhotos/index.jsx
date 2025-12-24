import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    Card, CardContent, CardHeader, Divider, Avatar, Box, Alert, CircularProgress, TextField, Button, CardActions, Collapse, Typography, Chip
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { red } from '@mui/material/colors'
import SendIcon from '@mui/icons-material/Send'
import CommentIcon from '@mui/icons-material/Comment'
import LikeIcon from '@mui/icons-material/ThumbUp';

import fetchModel from '../../lib/fetchModelData'
import { BE_URL } from '../../lib/config'
import UserComment from '../UserComment'
import './styles.css'

function UserPhotos({ setContext, currentUser, onRefresh }) { 
    const { userId } = useParams()
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [commentInputs, setCommentInputs] = useState({})
    const [expandedComments, setExpandedComments] = useState({})

    const dateTimeFormatter = useMemo(() => new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium', timeStyle: 'short',
    }), [])

    const loadData = async () => {
        try {
            const [userData, photosData] = await Promise.all([
                fetchModel(`/user/${userId}`),
                fetchModel(`/photosOfUser/${userId}`)
            ])
            if (userData) setContext(`Photos of ${userData.first_name} ${userData.last_name}`)
            setPhotos(photosData)
        } catch (err) {
            console.error("Error:", err)
            setError("Could not load photos.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [userId])

    const handleExpandClick = (photoId) => {
        setExpandedComments(prev => ({ ...prev, [photoId]: !prev[photoId] }))
    }

    const handleLike = async (photoId) => {
        try {
            const res = await fetch(`${BE_URL}/photos/${photoId}/like`, {
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) throw new Error('Like failed')
            const data = await res.json()
            // Update local state
            setPhotos(prev => prev.map(p => p._id === photoId ? { ...p, likes_count: data.likes_count, liked: data.liked } : p))
            if (onRefresh) onRefresh()
        } catch (err) {
            console.error('Error liking photo', err)
        }
    }

    const handleCommentSubmit = async (photoId) => {
        const commentText = commentInputs[photoId]
        if (!commentText || !commentText.trim()) return
        try {
            await fetch(`${BE_URL}/comment/commentsOfPhoto/${photoId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ comment: commentText })
            })
            setCommentInputs({ ...commentInputs, [photoId]: '' })
            loadData() 
            setExpandedComments(prev => ({ ...prev, [photoId]: true }))
            if (onRefresh) onRefresh()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <Box className="loading-box"><CircularProgress /></Box>
    if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    if (!photos || photos.length === 0) return <Alert severity="info" sx={{ m: 2 }}>This user has not posted any photos yet.</Alert>

    return (
        <Box className="photo-list-container">
            {photos.map((photo) => {
                //Count comment by user id
                let myCommentCount = 0
                if (currentUser && photo.comments) {
                    myCommentCount = photo.comments.filter(comment => {
                        if (comment.user && comment.user._id) {
                            return comment.user._id.toString() === currentUser._id.toString()
                        }
                        return false
                    }).length
                }
                
                return (
                    <Card key={photo._id} variant="outlined" className="photo-card">
                        <CardHeader
                            avatar={<Avatar sx={{ bgcolor: red[500] }}>P</Avatar>}
                            title={dateTimeFormatter.format(new Date(photo.date_time))}
                            subheader={photo.file_name}
                        />

                        <CardContent>
                            <Box
                                component="img"
                                src={`${BE_URL}/images/${photo.file_name}`}
                                alt={photo.file_name}
                                className="photo-image"
                            />
                        </CardContent>

                        <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton aria-label="like" size="small" onClick={() => handleLike(photo._id)} color={photo.liked ? 'primary' : 'default'}>
                                    <LikeIcon />
                                </IconButton>
                                <Typography variant="body2">{photo.likes_count || 0}</Typography>

                                <Button 
                                    startIcon={<CommentIcon />}
                                    onClick={() => handleExpandClick(photo._id)}
                                    size="small"
                                >
                                    {expandedComments[photo._id] 
                                        ? "Hide Comments" 
                                        : `Show Comments (${photo.comments?.length || 0})`}
                                </Button>
                            </Box>

                            {myCommentCount > 0 && (
                                <Chip 
                                    label={`Your comments: ${myCommentCount}`} 
                                    color="primary" 
                                    variant="outlined" 
                                    size="small"
                                    sx={{ marginRight: 1 }}
                                />
                            )}
                        </CardActions>

                        <Collapse in={expandedComments[photo._id]} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Divider sx={{ mb: 2 }} />
                                {photo.comments?.length > 0 ? (
                                    photo.comments.map((comment) => (
                                        <UserComment 
                                            key={comment._id} 
                                            comment={comment} 
                                            currentUser={currentUser}
                                            photoId={photo._id}
                                            onRefresh={() => {
                                                loadData()
                                                if (onRefresh) onRefresh()
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No comments yet.
                                    </Typography>
                                )}

                                {currentUser && (

                                    <Box className="comment-input-area">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Write a comment..."
                                            value={commentInputs[photo._id] || ''}
                                            onChange={(e) => setCommentInputs({ ...commentInputs, [photo._id]: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleCommentSubmit(photo._id)
                                                }
                                            }}
                                        />
                                        <Button variant="contained" endIcon={<SendIcon />} onClick={() => handleCommentSubmit(photo._id)}>
                                            Post
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Collapse>
                    </Card>
                )
            })}
        </Box>
    )
}

export default UserPhotos