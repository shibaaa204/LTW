import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Box, Alert, Input } from '@mui/material'
import { BE_URL } from '../../lib/config'
import './styles.css'

function PhotoAdd({ onRefresh, currentUser }) { 
    const [file, setFile] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            setError("Please select a file first.")
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(`${BE_URL}/photos/new`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }
            
            if (onRefresh) onRefresh() 

            if (currentUser) {
                navigate(`/photos/${currentUser._id}`)
            } else {
                navigate('/')
            }

        } catch (err) {
            console.error(err)
            setError("Error uploading photo.")
        }
    }

    return (
        <Box className="add-photo-container">
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Upload New Photo
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: '400px' }}>{error}</Alert>}

            <form onSubmit={handleUpload} className="add-photo-form">
                <Input
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{ accept: 'image/*' }}
                    fullWidth
                />

                <Box className="button-group">
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                    <Button variant="contained" type="submit" disabled={!file}>
                        Upload Photo
                    </Button>
                </Box>

                {file && (
                    <Box className="preview-container">
                        <Typography variant="subtitle1" fontWeight="bold">Preview:</Typography>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="preview-image"
                        />
                    </Box>
                )}
            </form>
        </Box>
    )
}

export default PhotoAdd