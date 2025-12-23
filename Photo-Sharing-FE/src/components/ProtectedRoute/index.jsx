import { Navigate } from "react-router-dom"

export default function ProtectedRoute({userLoggedIn, children}){
    
    if (!userLoggedIn){
        return (
            <Navigate to="/login" replace />
        )
    }
    return children
}