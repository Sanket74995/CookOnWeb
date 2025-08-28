import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import './../styles/Navbar.scss'
import Sidebar from "./Sidebar";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const navItems = [
        {
            id: 1,
            label: "Home",
            href: "/",
        },
        {
            id: 2,
            label: "Recipes",
            href: "#",
        },
        {
            id: 3,
            label: "Settings",
            href: "#",
        }
    ]

    return (
        <>
            <div className="navbar container">
                <Link className="logo" to="/">
                    <span className="cook">Cook</span>
                    <span className="cook">on</span>
                    <span className="cook">Web</span>
                </Link>
                <div className="navbar-items">
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.href}
                            className={location.pathname === item.href ? "active" : ""}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="auth-buttons">
                        <Link
                            to="/login"
                            className={`login-btn ${location.pathname === '/login' ? 'active' : ''}`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className={`register-btn ${location.pathname === '/register' ? 'active' : ''}`}
                        >
                            Register
                        </Link>
                    </div>
                </div>
                <div
                    onClick={toggleSidebar}
                    className={`sidebar_container ${isOpen ? "active" : ""}`}
                >
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>
            <Sidebar
                isOpen={isOpen}
                toggleSidebar={toggleSidebar}
                navItems={navItems}
            />
            <div
                className={`sidebar-overlay ${isOpen ? "active" : ""}`}
                onClick={toggleSidebar}
            ></div>
        </>
    )
}
export default Navbar;
