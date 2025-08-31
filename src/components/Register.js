import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Register.scss';

const Register = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
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

        // Username: alphanumeric, 3-15 chars
        const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
        if (!formData.username.trim()) {
            newErrors.username = t('username_required');
        } else if (!usernameRegex.test(formData.username)) {
            newErrors.username = t('username_invalid');
        }

        // Email: standard regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = t('email_required');
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t('email_invalid');
        }

        // Password: min 8 chars, at least one uppercase, one lowercase, one number, one special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!formData.password) {
            newErrors.password = t('password_required');
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = t('password_strength');
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('password_mismatch');
        }

        // First and last name: only letters, min 2 chars
        const nameRegex = /^[A-Za-z]{2,}$/;
        if (!formData.firstName.trim()) {
            newErrors.firstName = t('first_name_required');
        } else if (!nameRegex.test(formData.firstName)) {
            newErrors.firstName = t('first_name_invalid');
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = t('last_name_required');
        } else if (!nameRegex.test(formData.lastName)) {
            newErrors.lastName = t('last_name_invalid');
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
            // Call backend registration endpoint
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Reset form
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: ''
                });

                // Navigate directly to login page after successful registration
                window.location.href = '/login';
            } else {
                alert(data.message || t('registration_failed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(t('registration_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <h2>{t('create_account')}</h2>
                <p className="register-subtitle">{t('join_community')}</p>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">{t('first_name')} *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? 'error' : ''}
                                placeholder={t('enter_first_name')}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">{t('last_name')} *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? 'error' : ''}
                                placeholder={t('enter_last_name')}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">{t('username')} *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error' : ''}
                            placeholder={t('choose_username')}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

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

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">{t('password')} *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                placeholder={t('create_password')}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">{t('confirm_password')} *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                placeholder={t('confirm_your_password')}
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? t('creating_account') : t('create_account')}
                    </button>

                    <p className="login-link">
                        {t('already_have_account')} <a href="/login">{t('login_here')}</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
