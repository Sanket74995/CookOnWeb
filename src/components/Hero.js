import React from 'react';
import './../styles/Hero.scss';

const Hero = () => {
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

            <h1>Welcome to <span className="highlight">CookOnWeb</span></h1>
            <p>Where Recipes Speak to you!</p>
            <button className="hero-button">Get Started</button>
        </div>
    );
};

export default Hero;
