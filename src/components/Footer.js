import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './../styles/Footer.scss';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <Link to="/" className="footer-link">{t('footer_home')}</Link>
                    <Link to="/recipes" className="footer-link">{t('footer_recipes')}</Link>
                    <span className="footer-link">{t('footer_about')}</span>
                    <span className="footer-link">{t('footer_contact')}</span>
                </div>
                <div className="footer-copyright">
                    {t('footer_copyright')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
