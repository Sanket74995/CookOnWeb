import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEdit, faThumbsUp, faLock, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import './../styles/Navbar.scss'
import Sidebar from "./Sidebar";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        // Close dropdown if clicked outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setDropdownOpen(false);
        navigate('/');
    };
    const handleEditProfile = () => {
        navigate('/profile');
        setDropdownOpen(false);
    };

    const handleSubscription = () => {
        navigate('/subscription');
        setDropdownOpen(false);
    };

    const handleChangePassword = () => {
        navigate('/change-password');
        setDropdownOpen(false);
    };

    const handleSettings = () => {
        navigate('/settings');
        setDropdownOpen(false);
    };


    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
            href: "/recipes",
        },
        {
            id: 3,
            label: t('add_recipe'),
            href: "/add-recipe",
        },
        {
            id: 4,
            label: 'Planner',
            href: "/planner",
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
                                <option value="hi">हिंदी</option>
                            </select>
                        </div>
                        {user ? (
                            <div className="profile-container" ref={dropdownRef}>
                                <FontAwesomeIcon
                                    icon={faUserCircle}
                                    size="2x"
                                    className="profile-icon"
                                    onClick={toggleDropdown}
                                />
                                {dropdownOpen && (
                                    <div className="profile-dropdown">
                                        <div className="profile-header">
                                            <FontAwesomeIcon icon={faUserCircle} size="3x" className="profile-image" />
                                            <div className="profile-info">
                                                <div className="profile-name">{user.firstName} {user.lastName}</div>
                                                <div className="profile-email">{user.email}</div>
                                            </div>
                                        </div>
                                        <hr />
                                        <ul className="profile-menu">
                                            <li onClick={handleEditProfile}><FontAwesomeIcon icon={faEdit} /> {t('edit_profile')}</li>
                                            <li onClick={handleSubscription}><FontAwesomeIcon icon={faThumbsUp} /> {t('subscription')}</li>
                                            <li onClick={handleChangePassword}><FontAwesomeIcon icon={faLock} /> {t('change_password')}</li>
                                            <li onClick={handleSettings}><FontAwesomeIcon icon={faCog} /> {t('settings')}</li>
                                        </ul>


                                        <div className="profile-footer">
                                            <span className="help-center">{t('help_center')}</span> |{' '}
                                            <span className="signout" onClick={handleLogout}>
                                                <FontAwesomeIcon icon={faSignOutAlt} /> {t('signout')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
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
