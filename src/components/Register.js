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

        if (!formData.username.trim()) {
            newErrors.username = t('username_required');
        } else if (formData.username.length < 3) {
            newErrors.username = t('username_length');
        }

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

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('password_mismatch');
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = t('first_name_required');
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = t('last_name_required');
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
            // Simulate API call - replace with actual registration endpoint
            console.log('Registration data:', formData);

            // Show success message
            alert(t('registration_success'));

            // Reset form
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: ''
            });
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
