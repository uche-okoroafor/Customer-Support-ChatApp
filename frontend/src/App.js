import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import Dashboard from './Pages/Dashboard/Dashboard'
import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import { CustomersProvider } from './contexts/CustomersContext'
import { PusherProvider } from './contexts/PusherContext'
import { SnackBarProvider } from './contexts/SnackBarContext'
// import { SnackBarProvider } from './contexts/SnackBarContext'

function App () {
  return (
    <BrowserRouter>
      <SnackBarProvider>
        <AuthProvider>
          <PusherProvider>
            <CustomersProvider>
              <ChatProvider>
                <Routes>
                  <Route exact path='/' element={<Navigate to='/login' />} />
                  <Route exact path='/login' element={<Login />} />
                  <Route exact path='/sign-up' element={<SignUp />} />
                  <Route exact path='/dashboard' element={<ProtectedRoute />}>
                    <Route exact path='/dashboard' element={<Dashboard />} />
                  </Route>
                </Routes>
              </ChatProvider>
            </CustomersProvider>
          </PusherProvider>
        </AuthProvider>
      </SnackBarProvider>
    </BrowserRouter>
  )
}

export default App
