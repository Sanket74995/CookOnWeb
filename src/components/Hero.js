import React from 'react';
import './../styles/Hero.scss';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const location = useLocation();
    const { t } = useTranslation();

    return (
        <div className="hero">
            <div className="floating-icons">
                <span className="food-icon icon-1">🍕</span>
                <span className="food-icon icon-2">🥗</span>
                <span className="food-icon icon-3">🍩</span>
                <span className="food-icon icon-4">🍔</span>
                <span className="food-icon icon-5">🌮</span>
                <span className="food-icon icon-6">🍰</span>
            </div>

            <h1>{t('welcome')} <span className="highlight">CookOnWeb</span></h1>
            <p>{t('where_recipes_speak')}</p>
            <Link to="/register" className={`hero-button ${location.pathname === '/register' ? 'active' : ''}`}>
                {t('get_started')}
            </Link>
        </div>
    );
};

export default Hero;
