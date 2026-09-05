import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Tickets from './pages/Tickets'
import CreateTickets from './pages/CreateTickets'
import TicketDetail from './pages/TicketDetail'
import ManageUsers from './pages/ManageUsers'
import CategoryManagement from './pages/CategoryManagement'
import SessionExpired from './pages/SessionExpired'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                <Route path='/tickets' element={<ProtectedRoute> <Tickets /> </ProtectedRoute>} />
                <Route path='/create-tickets' element={<ProtectedRoute> <CreateTickets /> </ProtectedRoute>} />
                <Route path='/ticket/:id' element={<ProtectedRoute> <TicketDetail /> </ProtectedRoute>} />
                <Route path='/manage-users' element={<ProtectedRoute> <ManageUsers /> </ProtectedRoute>} />
                <Route path='/manage-categories' element={<ProtectedRoute> <CategoryManagement /> </ProtectedRoute>} />
                <Route path='/session-expired' element={<SessionExpired />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
