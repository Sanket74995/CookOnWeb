import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Sidebar from "./Sidebar";
import './../styles/Navbar.scss';
import { clearStoredSubscriptionDetails } from '../utils/subscription';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [user, setUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if (!desktop) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        const onOutsideClick = (e) => {
            if (!e.target.closest('.profile-container')) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('click', onOutsideClick);
        return () => document.removeEventListener('click', onOutsideClick);
    }, []);

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearStoredSubscriptionDetails();
        setUser(null);
        setIsProfileOpen(false);
        navigate('/');
    };

    const navItems = [
        { id: 1, key: 'home', label: t('home'), href: '/' },
        { id: 2, key: 'recipes', label: t('recipes'), href: '/recipes' },
        { id: 3, key: 'add_recipe', label: t('add_recipe'), href: '/add-recipe' },
        { id: 4, key: 'planner', label: t('planner'), href: '/planner' },
        { id: 5, key: 'collections', label: t('collections'), href: '/collections' },
        { id: 6, key: 'ai_recommendations', label: t('ai_recommendations'), href: '/recommendations' },
        { id: 7, key: 'collaborate', label: t('collaborate'), href: '/collaborate' },
        { id: 8, key: 'nutrition', label: t('nutrition'), href: '/nutrition' },
        { id: 9, key: 'dashboard', label: t('dashboard'), href: '/dashboard' }
    ];

    return (
        <>
            <div className={`navbar container ${isDesktop ? 'desktop' : ''}`}>
                <div className="navbar-left">
                    <button
                        className={`sidebar-toggle ${isOpen ? 'active' : ''}`}
                        aria-expanded={isOpen}
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                        onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <Link className="logo" to="/">
                        <span className="cook">{t('app_name')}</span>
                    </Link>
                </div>
                <div className="navbar-right">
                    {user && (
                        <div className={`profile-container ${isProfileOpen ? 'open' : ''}`}>
                            <button
                                className="profile-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsProfileOpen((prev) => !prev);
                                }}
                                aria-expanded={isProfileOpen}
                                aria-label="User menu"
                            >
                                <FontAwesomeIcon icon={faUserCircle} size="lg" />
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                                        <div>
                                            <strong>{user.firstName} {user.lastName}</strong>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                    <ul>
                                        <li onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}>
                                            {t('edit_profile')}
                                        </li>
                                        <li onClick={() => { setIsProfileOpen(false); navigate('/subscription'); }}>
                                            {t('subscription')}
                                        </li>
                                        <li onClick={() => { setIsProfileOpen(false); navigate('/change-password'); }}>
                                            {t('change_password')}
                                        </li>
                                        <li onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}>
                                            {t('settings')}
                                        </li>
                                        <li onClick={handleLogout}>
                                            {t('signout')}
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} navItems={navItems} />
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar} />
        </>
    );
};

export default Navbar;
