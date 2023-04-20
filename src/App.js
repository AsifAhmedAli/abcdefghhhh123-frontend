import Navbar from "../src/components/Admin/navbar";
import React, { Component } from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "../src/components/Admin/Admin";
import AdminLogin from "../src/components/AdminLogin/AdminLogin";
import Clothing from "./components/Admin/pages/Clothing";
import Location from "./components/Admin/pages/Location/index";
import Recommend from "./components/Admin/pages/Recommend";
import Preference from "./components/Admin/pages/Preference";
import Clothingcat from "./components/Admin/pages/Clothingcategory";
import LandingPage from "./components/LandingPage/LandingPage";
import { useLocation } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPass from "./components/ResetPassword/ResetPass";
import Test from "./components/LandingPage/Test"

let isLoggedIn=false;
var hours = 0.25; // to clear the localStorage after 1 hour
               // (if someone want to clear after 8hrs simply change hours=8)
var nowTime = new Date().getTime();
var setupTime = localStorage.getItem('setupTime');
if (setupTime == null) {
    localStorage.setItem('setupTime', nowTime)
} else {
    if(nowTime - setupTime > hours*60*60*1000) {
        localStorage.clear()
        localStorage.setItem('setupTime', nowTime);
    }
}
//if user is logged out and tries to access admin pages like location,recommend etc
function PrivateRoute({ children }) {
  isLoggedIn=false; 
  console.log(localStorage.getItem('jwtToken'))
  if(localStorage.getItem('jwtToken'))
    isLoggedIn=true; 
  console.log(isLoggedIn)
  return isLoggedIn ? <>{children}</> : <Navigate to="/AdminLogin" />;
}
//if user is logged in and tries to open the Admin Login
function ProtectedRoute({ children }) {
  isLoggedIn=false; 
  // console.log(localStorage.getItem('jwtToken'))
  if(localStorage.getItem('jwtToken'))
    isLoggedIn=true; 
  console.log(isLoggedIn)
  return isLoggedIn ? <Navigate to="/Location" /> : <>{children}</>;
}
function App() {
  let showNav=false;
    const { pathname } = useLocation();
    //console.log(pathname);
    if (pathname === "/home" || pathname === "/AdminLogin" || pathname.includes("/reset")||pathname === "/ForgotPassword"||pathname === "/") 
      showNav = false;
    else
      showNav = true; 
  return (
    <>
      {showNav && <Navbar />}
      <div className="container">
        <Routes>
          <Route exact path="/" element= {<LandingPage />}/>
          <Route path="/Admin" element={<Admin />} />
          <Route path="/home" element= {<LandingPage />}/>
          <Route path="/AdminLogin" element={<ProtectedRoute><AdminLogin /></ProtectedRoute>} />
          <Route path="/SignUp" element= {<PrivateRoute><SignUp /></PrivateRoute>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword />}/>
          <Route path="/reset/:token" element={<ResetPass />}/>
          <Route path="/Location" element={
            <PrivateRoute>
              <Location />
          </PrivateRoute>
          } />
          <Route path="/Clothing" element={<PrivateRoute><Clothing /></PrivateRoute>} />
          <Route path="/Recommend" element={<PrivateRoute><Recommend /></PrivateRoute>} />
          <Route path="/Preference" element={<PrivateRoute><Preference /></PrivateRoute>} />
          <Route path="/Clothingcat" element={<PrivateRoute><Clothingcat /></PrivateRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
