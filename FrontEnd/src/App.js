import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

import TopBar from './components/TopBar'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import UserPhotos from './components/UserPhotos'
import LoginRegister from './components/LoginRegister'
import ProtectedRoute from './components/ProtectedRoute'
import PhotoAdd from './components/PhotoAdd'

function App() {
    const [context, setContext] = useState('Home')
    const [user, setUser] = useState(null)

    const [refreshKey, setRefreshKey] = useState(0) //CC

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <>
            <TopBar context={context} user={user} setUser={setUser} setContext={setContext} />
            <Routes>
                <Route path="/login" element={
                    user ? <Navigate to={`/users/${user._id}`} replace /> : (
                        <Grid container spacing={2} sx={{ p: 2 }}>
                            <Grid item xs={12}>
                                <LoginRegister onLoginChange={setUser} />
                            </Grid>
                        </Grid>
                    )
                } />
                <Route path="/*" element={
                    <ProtectedRoute userLoggedIn={user}>
                        <Grid container spacing={2} sx={{ p: 2 }}>
                            <Grid item xs={12} sm={4} md={3}>
                                <Paper elevation={3}><UserList refreshKey={refreshKey}/></Paper>
                            </Grid>

                            <Grid item xs={12} sm={8} md={9}>
                                <Paper elevation={3} sx={{ p: 2, minHeight: '80vh' }}>
                                    <Routes>
                                        <Route path="/users/:userId" element={<UserDetail setContext={setContext} />} />
                                        <Route path="/photos/:userId" element={<UserPhotos setContext={setContext} onRefresh={handleRefresh} currentUser={user} />} />
                                        <Route path="/upload" element={<PhotoAdd currentUser={user} onRefresh={handleRefresh}/>} />
                                        <Route path="/users" element={<Alert severity="info" sx={{ mt: 2 }}>Select a user from the list.</Alert>} />
                                        
                                        <Route path="/" element={<Navigate to="/users" replace />} />
                                        <Route path="*" element={<Navigate to="/users" replace />} />
                                    </Routes>
                                </Paper>
                            </Grid>
                        </Grid>
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    )
}

export default App