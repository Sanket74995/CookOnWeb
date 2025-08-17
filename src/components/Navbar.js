import React from "react";
import './../styles/Navbar.scss'

const Navbar = () => {
    return (
        <div className="navbar container">
            <a className="logo" href="#">
                <span className="cook">Cook</span>
                <span className="on">On</span>
                <span className="web">Web</span>
            </a>
            <div className="navbar-items">
                <a href="#" className="active">Home</a>
                <a href="#">Recipes</a>
                <a href="#">Setting</a>
            </div>
        </div>
    )
}
export default Navbar;