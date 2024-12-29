import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import House from '../screens/Home'
import Project from '../screens/Project'

import UserAuth from '../auth/UserAuth.jsx'

const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<UserAuth><House/></UserAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/project" element={<UserAuth><Project/></UserAuth>} />
            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes