import React, { useState } from "react";
import './../styles/Navbar.scss'
import Sidebar from "./Sidebar";

const Navbar = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const handleRegisterClick = () => {
        if (onNavigate && typeof onNavigate === 'function') {
            onNavigate('register');
        }
        setIsOpen(false);
    };

    const handleHomeClick = () => {
        if (onNavigate && typeof onNavigate === 'function') {
            onNavigate('home');
        }
        setIsOpen(false);
    };

    const navItems = [
        {
            id: 1,
            label: "Home",
            href: "#",
            active: true,
            action: handleHomeClick
        },
        {
            id: 2,
            label: "Recipes",
            href: "#",
            active: false
        },
        {
            id: 3,
            label: "Settings",
            href: "#",
            active: false
        }
    ]

    return (
        <>
            <div className="navbar container">
                <a className="logo" href="#" onClick={handleHomeClick}>
                    <span className="cook">Cook</span>
                    <span className="on">On</span>
                    <span className="web">Web</span>
                </a>
                <div className="navbar-items">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            className={item.active ? "active" : ""}
                            onClick={item.action || (() => { })}
                        >
                            {item.label}
                        </a>
                    ))}
                    <div className="auth-buttons">
                        <button className="login-btn">Login</button>
                        <button className="register-btn" onClick={handleRegisterClick}>Register</button>
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
                onNavigate={onNavigate}
            />
            <div
                className={`sidebar-overlay ${isOpen ? "active" : ""}`}
                onClick={toggleSidebar}
            ></div>
        </>
    )
}
export default Navbar;
