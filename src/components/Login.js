import React, { useState } from 'react';
import '../styles/Login.scss';

const Login = ({onNavigate}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false)

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

    const handleRegisterClick = () => {
        if (onNavigate && typeof onNavigate === 'function') {
            onNavigate('register');
        }
        setIsOpen(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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
            // Simulate API call - replace with actual login endpoint
            console.log('Login data:', formData);

            // Show success message
            alert('Login successful! Welcome back to CookOnWeb!');

            // Reset form
            setFormData({
                email: '',
                password: ''
            });

            // Redirect to dashboard or home page
            // window.location.href = '/dashboard';
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h2>Welcome Back</h2>
                <p className="login-subtitle">Login to your cooking account</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Login...' : 'Login'}
                    </button>

                    <p className="register-link">
                        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleRegisterClick(); }}>Register here</a>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Login;
