const getJwtSecret = () => {
    const secret = String(process.env.JWT_SECRET || '').trim();

    if (secret) {
        return secret;
    }

    if (process.env.NODE_ENV === 'test') {
        return 'cookonweb-test-secret';
    }

    throw new Error('JWT_SECRET environment variable is required');
};

module.exports = {
    getJwtSecret
};
