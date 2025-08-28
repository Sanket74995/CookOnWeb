import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import './../styles/Navbar.scss'
import Sidebar from "./Sidebar";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const navItems = [
        {
            id: 1,
            label: t('home'),
            href: "/",
        },
        {
            id: 2,
            label: t('recipes'),
            href: "#",
        },
        {
            id: 3,
            label: t('settings'),
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
                        <div className="language-selector">
                            <select
                                value={i18n.language}
                                onChange={(e) => i18n.changeLanguage(e.target.value)}
                                className="language-dropdown"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="hi">हिंदी</option>
                            </select>
                        </div>
                        <Link
                            to="/login"
                            className={`login-btn ${location.pathname === '/login' ? 'active' : ''}`}
                        >
                            {t('login')}
                        </Link>
                        <Link
                            to="/register"
                            className={`register-btn ${location.pathname === '/register' ? 'active' : ''}`}
                        >
                            {t('register')}
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
