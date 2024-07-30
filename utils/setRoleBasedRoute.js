

const setRoleBasedOnRoute = (req, res, next) => {
    if (req.path.startsWith('/contractor')) {
        res.locals.role = 'contractor';
    } else if (req.path.startsWith('/worker')) {
        res.locals.role = 'worker';
    } else if (req.path.startsWith('/admin')) {
        res.locals.role = 'admin';
    } else if (req.path.startsWith('/user')) {
        res.locals.role = 'user';
    } else {
        res.locals.role = 'null'; // default role
    }
    next();
};

module.exports = setRoleBasedOnRoute;