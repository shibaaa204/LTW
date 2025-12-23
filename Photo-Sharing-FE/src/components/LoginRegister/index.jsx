import React, { useState } from 'react'
import { 
    Grid, Paper, Typography, TextField, Button, Alert, Box, Tabs, Tab 
} from '@mui/material'
import { BE_URL } from '../../lib/config'

import './styles.css'

function LoginRegister({ onLoginChange }) {
    const [tabValue, setTabValue] = useState(0)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [loginData, setLoginData] = useState({
        login_name: '',
        password: ''
    })

    const [regData, setRegData] = useState({
        login_name: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: ''
    })

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        setMessage({ type: '', text: '' })
    }

    const handleInput = (e, type) => {
        const { name, value } = e.target
        if (type === 'login') {
            setLoginData({ ...loginData, [name]: value })
        } else {
            setRegData({ ...regData, [name]: value })
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch(`${BE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
                credentials: 'include',
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Login failed')
            }

            const user = await response.json()
            onLoginChange(user)

        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (regData.password !== regData.confirm_password) {
            setMessage({ type: 'error', text: "Passwords do not match!" })
            return
        }
        
        if (!regData.login_name || !regData.password || !regData.first_name || !regData.last_name) {
            setMessage({ type: 'error', text: "Please fill all required fields (*)" })
            return
        }

        try {
            const response = await fetch(`${BE_URL}/user`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...regData }),
                credentials: 'include'
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Registration failed')
            }
            setMessage({ type: 'success', text: "Registration successful! Please login." })
            
            setRegData({
                login_name: '', password: '', confirm_password: '',
                first_name: '', last_name: '', location: '', description: '', occupation: ''
            })
            setTabValue(0)
        } catch (error) {
            setMessage({ type: 'error', text: error.message || "Registration failed" })
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" className="login-grid-container">
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={3} className="login-paper">
                    
                    <Box className="tab-container">
                        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" centered>
                            <Tab label="Login" />
                            <Tab label="Register" />
                        </Tabs>
                    </Box>

                    <Box className="form-box">
                        <Typography variant="h5" align="center" gutterBottom color="primary" className="form-title">
                            {tabValue === 0 ? 'Login' : 'Create an account'}
                        </Typography>

                        {message.text && (
                            <Alert severity={message.type} className="alert-message">{message.text}</Alert>
                        )}

                        {tabValue === 0 && (
                            <form onSubmit={handleLogin}>
                                <TextField 
                                    label="Login Name" fullWidth margin="normal" 
                                    name="login_name" value={loginData.login_name} onChange={(e) => handleInput(e, 'login')} 
                                    required 
                                />
                                <TextField 
                                    label="Password" type="password" fullWidth margin="normal" 
                                    name="password" value={loginData.password} onChange={(e) => handleInput(e, 'login')} 
                                    required 
                                />
                                <Button type="submit" variant="contained" fullWidth size="large" className="submit-button">
                                    Login
                                </Button>
                            </form>
                        )}

                        {tabValue === 1 && (
                            <form onSubmit={handleRegister}>
                                <TextField 
                                    label="Login Name *" fullWidth margin="dense" 
                                    name="login_name" value={regData.login_name} onChange={(e) => handleInput(e, 'register')} 
                                    required 
                                />
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField 
                                            label="First Name *" fullWidth margin="dense" 
                                            name="first_name" value={regData.first_name} onChange={(e) => handleInput(e, 'register')} 
                                            required 
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                            label="Last Name *" fullWidth margin="dense" 
                                            name="last_name" value={regData.last_name} onChange={(e) => handleInput(e, 'register')} 
                                            required 
                                        />
                                    </Grid>
                                </Grid>
                                <TextField 
                                    label="Password *" type="password" fullWidth margin="dense" 
                                    name="password" value={regData.password} onChange={(e) => handleInput(e, 'register')} 
                                    required 
                                />
                                <TextField 
                                    label="Confirm Password *" type="password" fullWidth margin="dense" 
                                    name="confirm_password" value={regData.confirm_password} onChange={(e) => handleInput(e, 'register')} 
                                    required 
                                />
                                
                                <TextField label="Occupation" fullWidth margin="dense" name="occupation" value={regData.occupation} onChange={(e) => handleInput(e, 'register')} />
                                <TextField label="Location" fullWidth margin="dense" name="location" value={regData.location} onChange={(e) => handleInput(e, 'register')} />
                                <TextField label="Description" fullWidth margin="dense" multiline rows={2} name="description" value={regData.description} onChange={(e) => handleInput(e, 'register')} />

                                <Button type="submit" variant="contained" color="primary" fullWidth size="large" className="submit-button">
                                    Register
                                </Button>
                            </form>
                        )}
                    </Box>

                </Paper>
            </Grid>
        </Grid>
    )
}

export default LoginRegister