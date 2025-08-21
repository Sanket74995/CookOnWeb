import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faCog } from '@fortawesome/free-solid-svg-icons';
import './../styles/Sidebar.scss'

const Sidebar = ({ isOpen, toggleSidebar, navItems, onNavigate }) => {
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

    const handleRegisterClick = () => {
        onNavigate('register');
        toggleSidebar();
    };

    const handleHomeClick = () => {
        onNavigate('home');
        toggleSidebar();
    };

    const handleLoginClick = () => {
        onNavigate('login');
        toggleSidebar();
    };

    return (
        <div className={`sidebar ${isOpen ? "active" : ""}`}>
            <div className="sidebar-header">
                <h2>Menu</h2>
                <button className="close-btn" onClick={toggleSidebar}>
                    &times;
                </button>
            </div>
            <ul className="sidebar-menu">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault();
                                if (item.action) {
                                    item.action();
                                }
                                toggleSidebar();
                            }}
                        >
                            <span className="icon-wrapper">
                                {getIcon(item.label)}
                            </span>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="sidebar-auth">
                <button className="sidebar-login-btn" onClick={handleLoginClick}>Login</button>
                <button className="sidebar-register-btn" onClick={handleRegisterClick}>Register</button>
            </div>
            <div className="sidebar-footer">
                <p>&copy; 2024 CookOnWeb</p>
            </div>
        </div>
    )
}

export default Sidebar;
