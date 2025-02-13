import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Landing_Page from "./index1";
import Dash from "./dashboard";
import { Bell } from 'lucide-react';
import Academic from "./academic-info";
import Attendance from "./attendance";
import Financial from "./fee";
import Login from "./login";
import Profile from "./profile";
import Registration from "./registration";
import AdminPage from "./a-d-m-i-n";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Navbar(){
  


  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left section with logo and navigation links */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded">
              <img src=""
              alt="Logo"
              />
            </div>
          </div>
          
          {/* Navigation links */}
          <div className="flex items-center space-x-6">
            <Link to ="/dashboard" className="text-white">Dashboard</Link>
            <Link to ="/academic-info" className="text-white">Academic Information</Link>
            <Link to ="/attendance" className="text-white">Attendance</Link>
            <Link to ="/fee" className="text-white">Financial Management</Link>
          </div>
        </div>

        {/* Right section with notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <Bell size={20} />
          </button>
          
          {/* Profile picture */}
          <div className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden">
            <Link to = '/profile'>
            <img 
              src="" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}





function Layout(){
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/registration'
  const isLandingPage = location.pathname === '/'

  return (
    <>
    {!(isLogin || isRegister || isLandingPage ) && <Navbar />}
      <Routes>
        <Route path = "/" element = {<Landing_Page />} />
        <Route path = '/dashboard' element = {<Dash />} />
        <Route path = '/academic-info' element = {<Academic />}/>
        <Route path = '/attendance' element = {<Attendance />} />
        <Route path = '/fee' element = {<Financial />} />
        <Route path = '/login' element = {<Login />} />
        <Route path = '/registration' element = {<Registration />} />
        <Route path = '/profile' element = {<Profile />} />
        <Route path = '/a-d-m-i-n' element = {<AdminPage />} />

      </Routes>
    </>
  );
}


function Index(){
  return(
    <Router>
      <Layout />
      <ToastContainer />
    </Router>
  )
}
export default Index;
