const parseList = (value) =>
    String(value || '')
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);

const admin = (req, res, next) => {
    const allowedEmails = parseList(process.env.ADMIN_EMAILS);
    const allowedUserIds = parseList(process.env.ADMIN_USER_IDS);
    const userEmail = String(req.user?.email || '').trim().toLowerCase();
    const userId = String(req.user?._id || req.userId || '').trim().toLowerCase();

    const isAllowed = allowedEmails.includes(userEmail) || allowedUserIds.includes(userId);

    if (!isAllowed) {
        return res.status(403).json({ message: 'Admin access required' });
    }

    next();
};

module.exports = admin;
