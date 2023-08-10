function isUser (req, res, next) {
    if (req.user?.email) {
        return next();
    }
    return res.status(401).render('error', { error: 'error de autenticación' });
}

function isAdmin(req, res, next) {
    const admin = req.user?.admin;
    console.log("admin", admin)
    console.log("admin", typeof admin)
    if (admin) {
        console.log("ingresó en isAdmin")
        return next();
    }
    console.log("no es admin")
    return res.status(403).render('error', { error: 'error de autorización' })
}


module.exports = {
    isUser,
    isAdmin
  };
