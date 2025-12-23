import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'
import fetchModel from '../../lib/fetchModelData'

import './styles.css'

function UserDetail({ setContext }) {
    const { userId } = useParams()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchModel(`/user/${userId}`)
                setUser(data)
                if (setContext) setContext(`${data.first_name} ${data.last_name}`)
            } catch (error) {
                console.error("Error:", error)
            }
        }
        fetchUserData()
    }, [userId, setContext])

    if (!user) return <Typography p={2}>Loading...</Typography>

    return (
        <Card variant="outlined" className="user-detail-card">
            <CardContent>
                <Typography variant="h4" gutterBottom className="user-detail-name">
                    {user.first_name} {user.last_name}
                </Typography>

                <Typography color="text.secondary" variant="h6" gutterBottom>
                    {user.occupation}
                </Typography>

                <Typography variant="body1" className="user-description">
                    "{user.description}"
                </Typography>

                <Typography variant="body2" color="text.secondary" className="user-location">
                    <strong>Location:</strong> {user.location}
                </Typography>

                <Box className="detail-action-box">
                    <Button
                        variant="contained"
                        component={Link}
                        to={`/photos/${user._id}`}
                    >
                        View Photos
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}

export default UserDetail