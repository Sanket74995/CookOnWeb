import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Login.scss';

const Login = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = t('email_required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('email_invalid');
        }

        if (!formData.password) {
            newErrors.password = t('password_required');
        } else if (formData.password.length < 6) {
            newErrors.password = t('password_length');
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert(t('login_success'));
                localStorage.setItem('token', data.token);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(t('login_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h2>{t('welcome')}</h2>
                <p className="login-subtitle">{t('login_subtitle')}</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">{t('email_address')} *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder={t('enter_email')}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{t('password')} *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder={t('enter_password')}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? t('logging_in') : t('login')}
                    </button>

                    <p className="register-link">
                        {t('no_account')} <a href="/register">{t('register_here')}</a>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Login;
