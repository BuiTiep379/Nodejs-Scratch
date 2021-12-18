const checkGuest = (req, res, next) => {
    // login nếu xác thực rồi thì chuyển sang dashboard 
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        return next();
    }
};

const checkAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

module.exports = { checkAdmin, checkGuest };