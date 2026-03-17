import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faBook,
    faCog,
    faCalendarDays,
    faUserCircle,
    faSignOutAlt,
    faLock,
    faThumbsUp,
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './../styles/Sidebar.scss'

const Sidebar = ({ isOpen, toggleSidebar, navItems }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toggleSidebar();
        navigate('/');
    };

    // Icon mapping for navigation items using FontAwesome
    const getIcon = (key) => {
        switch (key) {
            case 'home':
                return <FontAwesomeIcon icon={faHome} />;
            case 'recipes':
                return <FontAwesomeIcon icon={faBook} />;
            case 'settings':
                return <FontAwesomeIcon icon={faCog} />;
            case 'planner':
                return <FontAwesomeIcon icon={faCalendarDays} />;
            default:
                return null;
        }
    };

    return (
        <div className={`sidebar ${isOpen ? "active" : ""}`}>
            <div className="sidebar-header">
                <h2>{t('menu')}</h2>
                <button className="close-btn" onClick={toggleSidebar}>
                    &times;
                </button>
            </div>
            <ul className="sidebar-menu">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <Link
                            to={item.href}
                            className={location.pathname === item.href ? "active" : ""}
                            onClick={toggleSidebar}
                        >
                            <span className="icon-wrapper">
                                {getIcon(item.key)}
                            </span>
                            {item.label}
                        </Link>
                    </li>
                ))}
                <li key="settings">
                    <Link
                        to="/settings"
                        className={location.pathname === "/settings" ? "active" : ""}
                        onClick={toggleSidebar}
                    >
                        <span className="icon-wrapper">
                            <FontAwesomeIcon icon={faCog} />
                        </span>
                        {t('settings')}
                    </Link>
                </li>
            </ul>
            <div className="sidebar-language">
                <label htmlFor="sidebar-language-select">{t('language')}:</label>
                <select
                    id="sidebar-language-select"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    <option value="en">{t('language_english')}</option>
                    <option value="hi">{t('language_hindi')}</option>
                </select>
            </div>

            {user ? (
                <div className="sidebar-user-panel">
                    <div className="user-header">
                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                        <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <ul className="profile-menu">
                        <li onClick={() => { navigate('/profile'); toggleSidebar(); }}><FontAwesomeIcon icon={faEdit} /> {t('edit_profile')}</li>
                        <li onClick={() => { navigate('/subscription'); toggleSidebar(); }}><FontAwesomeIcon icon={faThumbsUp} /> {t('subscription')}</li>
                        <li onClick={() => { navigate('/change-password'); toggleSidebar(); }}><FontAwesomeIcon icon={faLock} /> {t('change_password')}</li>
                        <li onClick={() => { navigate('/settings'); toggleSidebar(); }}><FontAwesomeIcon icon={faCog} /> {t('settings')}</li>
                        <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> {t('signout')}</li>
                    </ul>
                </div>
            ) : (
                <div className="sidebar-auth">
                    <Link
                        to="/login"
                        className="sidebar-login-btn"
                        onClick={toggleSidebar}
                    >
                        {t('login')}
                    </Link>
                    <Link
                        to="/register"
                        className="sidebar-register-btn"
                        onClick={toggleSidebar}
                    >
                        {t('register')}
                    </Link>
                </div>
            )}

            <div className="sidebar-footer">
                <p>{t('footer_copyright')}</p>
            </div>
        </div>
    )
}

export default Sidebar;
