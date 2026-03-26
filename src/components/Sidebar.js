import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faBrain,
    faCalendarDays,
    faChartLine,
    faCog,
    faFolderOpen,
    faHome,
    faPlus,
    faUsers,
    faUtensils
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './../styles/Sidebar.scss';

const Sidebar = ({ isOpen, toggleSidebar, navItems }) => {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const iconMap = {
        home: faHome,
        recipes: faBook,
        add_recipe: faPlus,
        planner: faCalendarDays,
        collections: faFolderOpen,
        ai_recommendations: faBrain,
        collaborate: faUsers,
        nutrition: faChartLine,
        dashboard: faUtensils,
        settings: faCog
    };

    const getIcon = (key) => {
        const icon = iconMap[key] || faBook;
        return <FontAwesomeIcon icon={icon} />;
    };

    return (
        <div className={`sidebar ${isOpen ? "active" : ""}`}>
            <div className="sidebar-header">
                <h2>{t('menu')}</h2>
                <button className="close-btn" onClick={toggleSidebar}>
                    &times;
                </button>
            </div>

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
                            {getIcon('settings')}
                        </span>
                        {t('settings')}
                    </Link>
                </li>
            </ul>

            <div className="sidebar-footer">
                <p>{t('footer_copyright')}</p>
            </div>
        </div>
    );
};

export default Sidebar;
