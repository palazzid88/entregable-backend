
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

function isPremium(req, res, next) {
    const premium = req.user?.premium;
    console.log("premium en middleware", premium);
    if (premium) {
        console.log("premium is true");
        return next();
    } else {
    return res.status(403).json({ error: 'No tiene los privilegios para realizar esta operación' });
}
}

function isProductCreator(req, res, next) {

    const isAdmin = req.user?.isAdmin;
    const isPremium = req.user?.premium;

    if (isAdmin || isPremium) {
        return next()
    } else {
        return res.status(403).json({ error: 'No tiene los privilegios para realizar esta operación' });
    }
}


module.exports = {
    isUser,
    isAdmin,
    isPremium,
    isProductCreator
  };
