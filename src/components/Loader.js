import React from 'react';
import '../styles/Loader.scss';

const Loader = ({
  label = 'Loading...',
  variant = 'page',
  size = 'md',
  className = ''
}) => {
  const classes = ['app-loader', `app-loader--${variant}`, `app-loader--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="status" aria-live="polite">
      <div className="app-loader__orb" aria-hidden="true">
        <div className="app-loader__ring" />
        <div className="app-loader__core">
          <span />
          <span />
          <span />
        </div>
      </div>
      {label ? <p className="app-loader__label">{label}</p> : null}
    </div>
  );
};

export default Loader;
