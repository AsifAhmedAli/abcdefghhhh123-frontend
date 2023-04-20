//import { Component } from "react";
import './footer.css';
import { useLocation } from "react-router-dom";


const Footer = ({ path }) => {
    let showAdmin=false;
    const { pathname } = useLocation();
    //console.log(pathname);
    if (pathname === "/home") 
        showAdmin = true;
    else
        showAdmin = false; 
    return(
    <div className="footer">
       { showAdmin === true &&
        <a href="/AdminLogin" className="adminCss" >Admin</a>}
        { showAdmin === false &&
        <a href="/home" className="adminCss" >Home</a>}
    </div>
    );
  };
export default Footer;