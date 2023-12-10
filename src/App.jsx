import React from 'react'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'


export default function App() {
  return <BrowserRouter >
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/sign-in" element={<Signin />} />
    <Route path='/sign-up' element={<SignUp />} />
    <Route path='/profile' element={<Profile />} />
  </Routes>
  </BrowserRouter>
}

