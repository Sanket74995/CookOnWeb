import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faCog } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './../styles/Sidebar.scss'

const Sidebar = ({ isOpen, toggleSidebar, navItems }) => {
    const location = useLocation();
    const { t } = useTranslation();

    // Icon mapping for navigation items using FontAwesome
    const getIcon = (label) => {
        switch (label.toLowerCase()) {
            case 'home':
                return <FontAwesomeIcon icon={faHome} />;
            case 'recipes':
                return <FontAwesomeIcon icon={faBook} />;
            case 'settings':
                return <FontAwesomeIcon icon={faCog} />;
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
                                {getIcon(item.label)}
                            </span>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
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
            <div className="sidebar-footer">
                <p>&copy; 2024 CookOnWeb</p>
            </div>
        </div>
    )
}

export default Sidebar;
