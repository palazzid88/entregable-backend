
function isUser (req, res, next) {
    if (req.user?.email) {
        return next();
    }
    return res.status(401).render('error', { error: 'error de autenticación' });
}

function isAdmin(req, res, next) {
    const isAdmin = req.user?.isAdmin;
    console.log("isAdmin", isAdmin)
    console.log("isAdmin", typeof isAdmin)
    if (isAdmin) {
        console.log("ingresó en isAdmin")
        return next();
    }
    console.log("no es isAdmin")
    return res.status(403).render('error', { error: 'error de autorización' })
}


module.exports = {
    isUser,
    isAdmin
  };
